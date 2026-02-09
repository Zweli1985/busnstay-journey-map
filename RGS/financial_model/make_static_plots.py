"""
Generate static PNG plots from financial_model CSVs so the LaTeX document can include
static images (single-file PDF).

Usage: python make_static_plots.py

Writes:
 - housing_revenue.png
 - loan_balance.png
 - gas_posttax.png

Files read (expected):
 - housing_years.csv (columns: year, revenue)
 - loan_schedule.csv (columns: year, closing_balance)
 - gas_years.csv (columns: year, post_tax)

The script is tolerant if files are missing and will exit with non-zero code.
"""
from pathlib import Path
import sys

try:
    import pandas as pd
    import matplotlib.pyplot as plt
except Exception:
    print("Missing required Python packages. Please run: pip install pandas matplotlib")
    sys.exit(2)

BASE = Path(r"C:/Users/zwexm/LPSN/RGS/financial_model")

files = {
    'housing': BASE / 'housing_years.csv',
    'loan': BASE / 'loan_schedule.csv',
    'gas': BASE / 'gas_years.csv'
}

out = BASE

# Housing revenue
if files['housing'].exists():
    df = pd.read_csv(files['housing'])
    if 'year' in df.columns and 'revenue' in df.columns:
        plt.figure(figsize=(10,4))
        plt.plot(df['year'], df['revenue'], marker='o', color='#0b5394')
        plt.title('Annual housing revenue (USD)')
        plt.xlabel('Year')
        plt.ylabel('Revenue (USD)')
        plt.grid(True, linestyle='--', alpha=0.4)
        plt.tight_layout()
        plt.savefig(out / 'housing_revenue.png', dpi=200)
        print('Wrote', out / 'housing_revenue.png')
        plt.close()
    else:
        print('housing_years.csv missing expected columns (year,revenue)')
        sys.exit(3)
else:
    print('housing_years.csv not found at', files['housing'])
    sys.exit(3)

# Loan balance
if files['loan'].exists():
    df = pd.read_csv(files['loan'])
    if 'year' in df.columns and 'closing_balance' in df.columns:
        plt.figure(figsize=(10,4))
        plt.plot(df['year'], df['closing_balance'], marker='o', color='#cc0000')
        plt.title('BCG loan closing balance (USD)')
        plt.xlabel('Year')
        plt.ylabel('Outstanding balance (USD)')
        plt.grid(True, linestyle='--', alpha=0.4)
        plt.tight_layout()
        plt.savefig(out / 'loan_balance.png', dpi=200)
        print('Wrote', out / 'loan_balance.png')
        plt.close()
    else:
        print('loan_schedule.csv missing expected columns (year,closing_balance)')
        sys.exit(3)
else:
    print('loan_schedule.csv not found at', files['loan'])
    sys.exit(3)

# Gas post-tax
if files['gas'].exists():
    df = pd.read_csv(files['gas'])
    if 'year' in df.columns and 'post_tax' in df.columns:
        plt.figure(figsize=(10,4))
        plt.plot(df['year'], df['post_tax'], marker='o', color='#2e8b57')
        plt.title('Halso gas post-tax profit by year (USD)')
        plt.xlabel('Year')
        plt.ylabel('Post-tax profit (USD)')
        plt.grid(True, linestyle='--', alpha=0.4)
        plt.tight_layout()
        plt.savefig(out / 'gas_posttax.png', dpi=200)
        print('Wrote', out / 'gas_posttax.png')
        plt.close()
    else:
        print('gas_years.csv missing expected columns (year,post_tax)')
        sys.exit(3)
else:
    print('gas_years.csv not found at', files['gas'])
    sys.exit(3)

print('All plots generated successfully.')
