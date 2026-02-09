This small financial model reproduces the illustrative scenarios added to the LaTeX document and lets you vary parameters in `params.json`.

Files produced by this model:

- `housing_years.csv` — year-by-year housing revenue, costs and post-tax distributable cash for the SPV
- `loan_schedule.csv` — illustrative loan amortisation schedule for the BCG loan
- `gas_years.csv` — Halso gas business year-by-year P&L (per assumptions)
- `summary.csv` — top-level aggregates and Halso combined benefit

How to run (PowerShell):

```powershell
# from c:\Users\zwexm\LPSN\RGS
python financial_model\model.py
```

Edit `financial_model/params.json` to change assumptions (rollout years, prices, loan terms, etc.). The script is intentionally simple and outputs CSVs you can open in Excel for further formatting or inclusion in the LaTeX appendix.
