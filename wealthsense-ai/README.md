# WealthSense AI

End-to-end deep learning financial advisor platform implementing the proposal:

- Data ingestion from Yahoo Finance (`2015-2023`) for `AAPL`, `MSFT`, `NVDA`, `TSLA`, `SPY`
- Feature engineering (SMA, EMA, RSI, returns, volatility)
- Model comparison: `LSTM`, `GRU`, `Transformer` (PyTorch)
- Ensemble model using inverse-RMSE weighting on validation split
- Conformal prediction intervals (`90%`) + interval coverage tracking
- Evaluation metrics: `MAE`, `RMSE`, `MAPE`, directional accuracy
- Trading strategy simulation vs model signals
- Baseline benchmark: buy-and-hold strategy
- Goal planner via Monte Carlo simulation
- Streamlit dashboard with optional Claude explanations

## Quickstart

```bash
cd wealthsense-ai
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Train + Evaluate

```bash
PYTHONPATH=src python -m wealthsense_ai.train
```

Artifacts saved to `wealthsense-ai/artifacts/`:

- `metrics.json`
- `forecasts.csv`
- `strategy_results.csv`
- `models/*.pt`

## Launch Dashboard

```bash
PYTHONPATH=src streamlit run src/wealthsense_ai/app.py
```

Optional AI explanation:

```bash
export ANTHROPIC_API_KEY=your_key_here
```

## Included "State-of-the-Art" Components

1. Multi-architecture benchmark (`LSTM`, `GRU`, `Transformer`, and `ensemble`).
2. Conformal uncertainty intervals to communicate forecast reliability.
3. Model strategy vs buy-and-hold performance benchmark.

## Next Upgrades

1. Add exogenous features (Fed rates, CPI, VIX, earnings events).
2. Add walk-forward validation and per-regime performance tracking.
3. Add drift detection + scheduled retraining pipeline.
