from __future__ import annotations

import json
import os

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st
from dotenv import load_dotenv

from .config import PathsConfig
from .simulation import run_goal_monte_carlo
from .strategy import summarize_forecasts

load_dotenv()


def _load_artifacts(paths: PathsConfig) -> tuple[pd.DataFrame, pd.DataFrame, dict]:
    if not paths.forecasts_file.exists() or not paths.metrics_file.exists():
        raise FileNotFoundError("Missing training artifacts. Run python -m wealthsense_ai.train first.")

    forecasts = pd.read_csv(paths.forecasts_file, parse_dates=["date"])
    strategy = (
        pd.read_csv(paths.strategy_file)
        if paths.strategy_file.exists()
        else pd.DataFrame(columns=["ticker", "model", "cumulative_return", "sharpe_ratio", "max_drawdown"])
    )
    with paths.metrics_file.open("r", encoding="utf-8") as f:
        metrics = json.load(f)
    return forecasts, strategy, metrics


def _render_chat_summary(prompt: str, context: str) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return "Set `ANTHROPIC_API_KEY` to enable AI explanations."
    try:
        from anthropic import Anthropic

        client = Anthropic(api_key=api_key)
        resp = client.messages.create(
            model="claude-3-7-sonnet-latest",
            max_tokens=250,
            messages=[
                {
                    "role": "user",
                    "content": (
                        "You are a financial assistant. Explain clearly with risk caveats.\n"
                        f"Dashboard context:\n{context}\n\nQuestion:\n{prompt}"
                    ),
                }
            ],
        )
        return resp.content[0].text if resp.content else "No response returned."
    except Exception as exc:
        return f"AI explanation unavailable: {exc}"


def _build_portfolio_series(forecasts: pd.DataFrame, weights: dict[str, float]) -> pd.DataFrame:
    ens = forecasts[forecasts["model"] == "ensemble"].copy()
    ens = ens[ens["ticker"].isin(list(weights.keys()))]
    pivot = ens.pivot_table(index="date", columns="ticker", values="actual", aggfunc="mean").dropna()
    returns = pivot.pct_change().dropna()

    # Normalize in case the sliders do not sum to exactly 1.0.
    w = np.array([weights[t] for t in returns.columns], dtype=float)
    w = w / max(w.sum(), 1e-8)
    portfolio_returns = returns.values @ w
    out = pd.DataFrame({"date": returns.index, "portfolio_return": portfolio_returns})
    out["cumulative"] = (1.0 + out["portfolio_return"]).cumprod() - 1.0
    return out


def _portfolio_metrics(returns: pd.Series) -> dict[str, float]:
    if returns.empty:
        return {"cumulative": 0.0, "annualized_vol": 0.0, "sharpe": 0.0, "max_drawdown": 0.0}
    cumulative = float((1.0 + returns).prod() - 1.0)
    annualized_vol = float(returns.std() * np.sqrt(252.0))
    excess = returns - (0.02 / 252.0)
    sharpe = 0.0 if excess.std() == 0.0 else float(np.sqrt(252.0) * excess.mean() / excess.std())
    equity = (1.0 + returns).cumprod()
    drawdown = equity / equity.cummax() - 1.0
    return {
        "cumulative": cumulative,
        "annualized_vol": annualized_vol,
        "sharpe": sharpe,
        "max_drawdown": float(drawdown.min()),
    }


def main() -> None:
    st.set_page_config(page_title="WealthSense AI", layout="wide")
    st.title("WealthSense AI - Personalized Financial Advisor")
    st.caption("LSTM vs GRU vs Transformer forecasts + goal planning simulation")

    paths = PathsConfig()
    paths.ensure()

    try:
        forecasts, strategy, metrics = _load_artifacts(paths)
    except FileNotFoundError as exc:
        st.error(str(exc))
        st.stop()

    tab_portfolio, tab_forecast, tab_goal, tab_chat = st.tabs(
        ["Portfolio Analytics", "Forecast Comparison", "Goal Planning", "AI Chat"]
    )

    all_tickers = sorted(forecasts["ticker"].unique())

    with tab_portfolio:
        st.subheader("Portfolio Analytics Dashboard")
        selected = st.multiselect(
            "Portfolio tickers",
            options=all_tickers,
            default=all_tickers[:3],
        )
        if not selected:
            st.info("Select at least one ticker to compute portfolio analytics.")
        else:
            st.markdown("Set your portfolio weights (they will be normalized automatically).")
            cols = st.columns(min(4, len(selected)))
            weights: dict[str, float] = {}
            for idx, ticker in enumerate(selected):
                with cols[idx % len(cols)]:
                    weights[ticker] = st.slider(
                        f"{ticker} weight",
                        min_value=0.0,
                        max_value=1.0,
                        value=1.0 / len(selected),
                        step=0.05,
                    )

            series = _build_portfolio_series(forecasts=forecasts, weights=weights)
            pm = _portfolio_metrics(series["portfolio_return"])

            m1, m2, m3, m4 = st.columns(4)
            m1.metric("Cumulative Return", f"{pm['cumulative'] * 100:.2f}%")
            m2.metric("Annualized Volatility", f"{pm['annualized_vol'] * 100:.2f}%")
            m3.metric("Sharpe Ratio", f"{pm['sharpe']:.2f}")
            m4.metric("Max Drawdown", f"{pm['max_drawdown'] * 100:.2f}%")

            wdf = pd.DataFrame({"ticker": list(weights.keys()), "weight": list(weights.values())})
            pie = px.pie(wdf, names="ticker", values="weight", title="Asset Allocation")
            st.plotly_chart(pie, use_container_width=True)

            cfig = px.line(series, x="date", y="cumulative", title="Portfolio Cumulative Return (2023)")
            st.plotly_chart(cfig, use_container_width=True)

            sector_map = {"AAPL": "Technology", "MSFT": "Technology", "NVDA": "Technology", "TSLA": "Automotive", "SPY": "Diversified ETF"}
            sector_df = (
                pd.DataFrame({"ticker": list(weights.keys()), "weight": list(weights.values())})
                .assign(sector=lambda d: d["ticker"].map(sector_map).fillna("Other"))
                .groupby("sector", as_index=False)["weight"]
                .sum()
            )
            sfig = px.bar(sector_df, x="sector", y="weight", title="Sector Exposure")
            st.plotly_chart(sfig, use_container_width=True)

    with tab_forecast:
        st.subheader("Deep Learning Forecast View")
        ticker = st.selectbox("Ticker", all_tickers)
        subset = forecasts[forecasts["ticker"] == ticker].copy()
        best_model_row = summarize_forecasts(subset).iloc[0]
        best_model = str(best_model_row["model"])
        best_subset = subset[subset["model"] == best_model].sort_values("date")

        c1, c2 = st.columns(2)
        with c1:
            plot_df = subset.melt(
                id_vars=["date", "model"],
                value_vars=["actual", "predicted"],
                var_name="series",
                value_name="price",
            )
            fig = px.line(
                plot_df,
                x="date",
                y="price",
                color="model",
                line_dash="series",
                title=f"Forecasts vs Actual ({ticker})",
            )
            st.plotly_chart(fig, use_container_width=True)
            if {"pred_lower", "pred_upper"}.issubset(best_subset.columns):
                band_fig = go.Figure()
                band_fig.add_trace(go.Scatter(x=best_subset["date"], y=best_subset["actual"], mode="lines", name="Actual"))
                band_fig.add_trace(go.Scatter(x=best_subset["date"], y=best_subset["pred_upper"], mode="lines", line=dict(width=0), showlegend=False))
                band_fig.add_trace(
                    go.Scatter(
                        x=best_subset["date"],
                        y=best_subset["pred_lower"],
                        mode="lines",
                        fill="tonexty",
                        fillcolor="rgba(99, 110, 250, 0.2)",
                        line=dict(width=0),
                        name=f"{best_model} 90% interval",
                    )
                )
                band_fig.add_trace(
                    go.Scatter(x=best_subset["date"], y=best_subset["predicted"], mode="lines", name=f"{best_model} prediction")
                )
                band_fig.update_layout(title=f"Best Model with Confidence Band ({best_model})")
                st.plotly_chart(band_fig, use_container_width=True)
        with c2:
            summary_table = summarize_forecasts(subset)
            st.dataframe(summary_table, use_container_width=True)
            st.subheader("Trading Strategy Comparison")
            st.dataframe(strategy[strategy["ticker"] == ticker], use_container_width=True)

    with tab_goal:
        st.subheader("Goal-Based Monte Carlo Planner")
        g1, g2, g3, g4 = st.columns(4)
        with g1:
            current_balance = st.number_input("Current Balance ($)", min_value=0.0, value=20000.0, step=500.0)
        with g2:
            monthly_contribution = st.number_input("Monthly Contribution ($)", min_value=0.0, value=1200.0, step=50.0)
        with g3:
            target_amount = st.number_input("Goal Target ($)", min_value=1000.0, value=60000.0, step=1000.0)
        with g4:
            years = st.number_input("Timeline (Years)", min_value=0.5, value=3.0, step=0.5)

        result = run_goal_monte_carlo(
            current_balance=current_balance,
            monthly_contribution=monthly_contribution,
            target_amount=target_amount,
            years=years,
        )
        st.metric("Goal Success Probability", f"{result['success_probability'] * 100:.1f}%")
        st.metric("Expected Terminal Value", f"${result['expected_terminal_value']:,.0f}")
        st.metric("Median Shortfall", f"${result['median_shortfall']:,.0f}")
        st.metric("Suggested Monthly Contribution", f"${result['recommended_monthly_contribution']:,.0f}")

    with tab_chat:
        st.subheader("AI Chat Explanation Interface")
        question = st.text_input("Ask about your plan", value="I want to buy a home in 3 years. Am I on track?")
        if st.button("Generate explanation"):
            leaderboard = summarize_forecasts(forecasts)
            context = (
                f"model_metrics={leaderboard.to_dict(orient='records')}; "
                f"training_device={metrics.get('device')}; "
                f"supported_tickers={all_tickers}"
            )
            st.write(_render_chat_summary(prompt=question, context=context))


if __name__ == "__main__":
    main()
