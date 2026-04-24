---
name: wealthsense-e2e-validator
description: Validate WealthSense AI end-to-end behavior by running training, checking artifact integrity, launching Streamlit, and triaging runtime errors. Use when the user asks to test the WealthSense app, verify the model pipeline, or debug website/app startup issues.
---
# WealthSense E2E Validator

## Use this skill when

- User asks to test the WealthSense build.
- Streamlit app fails to start or throws runtime exceptions.
- Model pipeline outputs need verification before demo or push.

## Validation workflow

Copy this checklist and execute in order:

```text
WealthSense E2E checklist
- [ ] 1) Verify Python runtime and environment variables
- [ ] 2) Run training pipeline end to end
- [ ] 3) Validate generated artifacts (files + row counts + schema basics)
- [ ] 4) Launch Streamlit and confirm accessible URL
- [ ] 5) Read terminal output for traceback/errors
- [ ] 6) If broken, patch and rerun from step 2
```

## Commands

Run from repository root:

```bash
export DYLD_LIBRARY_PATH="/opt/homebrew/opt/expat/lib:$DYLD_LIBRARY_PATH"
export PYTHONPATH="wealthsense-ai/src"
python3 -m wealthsense_ai.train
```

Artifact sanity check:

```bash
python3 -c "import pandas as pd; f=pd.read_csv('wealthsense-ai/artifacts/forecasts.csv'); s=pd.read_csv('wealthsense-ai/artifacts/strategy_results.csv'); print(f'forecasts={len(f)} strategy={len(s)} models={sorted(f.model.unique())}')"
```

Launch app:

```bash
python3 -m streamlit run wealthsense-ai/src/wealthsense_ai/app.py --server.headless true --server.port 8504
```

## Debug rules

- Always inspect terminal output if app starts but page fails.
- For `ImportError` caused by relative imports in `app.py`, support both:
  - relative package imports (`from .config import ...`)
  - absolute imports fallback (`from wealthsense_ai.config import ...`)
- After any patch, rerun training + app launch, not just compile checks.
- Report final local and network URLs when healthy.

## Done criteria

- Training exits with code 0.
- `forecasts.csv`, `metrics.json`, `strategy_results.csv` are present and readable.
- Streamlit process is running and prints Local URL.
- No active traceback in latest terminal output.
