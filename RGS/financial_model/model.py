import json
import csv
import os
from math import isclose

# make paths relative to this script's directory so the script can be run from any cwd
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARAMS_PATH = os.path.join(BASE_DIR, 'params.json')
with open(PARAMS_PATH) as f:
    params = json.load(f)

start_year = params['start_year']
# Housing
TH = params['housing']['total_homes']
RY = params['housing']['rollout_years']
price = params['housing']['price_per_unit']
cost = params['housing']['cost_per_unit']
opex_pct = params['housing']['opex_pct_of_revenue']
tax = params['housing']['tax_rate']
halso_pct = params['housing']['halso_equity_pct']

# Loan
loan_principal = params['loan']['principal']
loan_rate = params['loan']['annual_rate']
loan_term = params['loan']['term_years']

# Gas
gas_years = params['gas']['years']
gas_rev_y1 = params['gas']['revenue_per_home_year1']
gas_escal = params['gas']['annual_escalation']
gas_cogs_pct = params['gas']['cogs_pct']
gas_opex_pct = params['gas']['opex_pct']
gas_tax = params['gas']['tax_rate']

homes_per_year = [TH // RY] * RY
remainder = TH - sum(homes_per_year)
for i in range(remainder):
    homes_per_year[i] += 1

years = [start_year + i for i in range(RY)]

# Housing year-by-year
housing_rows = []
for i, y in enumerate(years):
    homes = homes_per_year[i]
    revenue = homes * price
    cogs = homes * cost
    gross = revenue - cogs
    opex = revenue * opex_pct
    ebit = gross - opex
    interest = 0  # separate loan schedule
    pre_tax = ebit - interest
    tax_paid = max(pre_tax * tax, 0)
    post_tax = pre_tax - tax_paid
    housing_rows.append({
        'year': y,
        'homes_built': homes,
        'revenue': revenue,
        'cogs': cogs,
        'gross_profit': gross,
        'opex': opex,
        'pre_tax': pre_tax,
        'tax': tax_paid,
        'post_tax_distributable': post_tax
    })

# Aggregate housing totals
total_revenue = sum(r['revenue'] for r in housing_rows)
total_cogs = sum(r['cogs'] for r in housing_rows)
total_gross = sum(r['gross_profit'] for r in housing_rows)
total_post_tax = sum(r['post_tax_distributable'] for r in housing_rows)

# Halso share
halso_share = total_post_tax * halso_pct

# Loan amortisation (level annuity)
# Payment A = r*PV / (1 - (1+r)^-n)
r = loan_rate
n = loan_term
PV = loan_principal
A = r * PV / (1 - (1 + r) ** (-n))
loan_rows = []
bal = PV
for t in range(1, n + 1):
    interest_paid = bal * r
    principal_paid = A - interest_paid
    bal = bal - principal_paid
    if bal < 1e-6:
        bal = 0.0
    loan_rows.append({
        'year': start_year + t - 1,
        'opening_balance': round((bal + principal_paid), 2),
        'payment': round(A, 2),
        'interest': round(interest_paid, 2),
        'principal': round(principal_paid, 2),
        'closing_balance': round(bal, 2)
    })

# Gas business year-by-year
gas_rows = []
for t in range(gas_years):
    y = start_year + t
    rev_per_home = gas_rev_y1 * ((1 + gas_escal) ** t)
    # assume all 90k homes are connected from start for gas totals (conservative simplification)
    total_rev = rev_per_home * TH
    cogs = total_rev * gas_cogs_pct
    opex = total_rev * gas_opex_pct
    pre_tax = total_rev - cogs - opex
    tax_paid = max(pre_tax * gas_tax, 0)
    post_tax = pre_tax - tax_paid
    gas_rows.append({
        'year': y,
        'rev_per_home': round(rev_per_home, 2),
        'total_rev': round(total_rev, 2),
        'cogs': round(cogs, 2),
        'opex': round(opex, 2),
        'pre_tax': round(pre_tax, 2),
        'tax': round(tax_paid, 2),
        'post_tax': round(post_tax, 2)
    })

# Gas aggregate
gas_total_rev = sum(r['total_rev'] for r in gas_rows)
gas_total_post_tax = sum(r['post_tax'] for r in gas_rows)
halso_gas_share = gas_total_post_tax  # gas business is Halso's; do not apply equity split

# Write CSVs

def write_csv(path, rows, fieldnames):
    out_path = os.path.join(BASE_DIR, path)
    # ensure directory exists
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

write_csv('housing_years.csv', housing_rows, ['year','homes_built','revenue','cogs','gross_profit','opex','pre_tax','tax','post_tax_distributable'])
write_csv('loan_schedule.csv', loan_rows, ['year','opening_balance','payment','interest','principal','closing_balance'])
write_csv('gas_years.csv', gas_rows, ['year','rev_per_home','total_rev','cogs','opex','pre_tax','tax','post_tax'])

# Summary file
summary_path = os.path.join(BASE_DIR, 'summary.csv')
with open(summary_path, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['metric', 'value'])
    writer.writerow(['total_homes', TH])
    writer.writerow(['total_housing_revenue', total_revenue])
    writer.writerow(['total_housing_cogs', total_cogs])
    writer.writerow(['total_housing_gross', total_gross])
    writer.writerow(['total_housing_post_tax_distributable', total_post_tax])
    writer.writerow(['halso_share_of_housing_post_tax', halso_share])
    writer.writerow(['loan_principal', loan_principal])
    writer.writerow(['loan_annual_payment', round(A,2)])
    writer.writerow(['loan_term_years', loan_term])
    writer.writerow(['gas_total_revenue', round(gas_total_rev,2)])
    writer.writerow(['gas_total_post_tax', round(gas_total_post_tax,2)])
    writer.writerow(['halso_gas_post_tax_total', round(halso_gas_share,2)])
    writer.writerow(['halso_combined_benefit', round(halso_share + halso_gas_share,2)])

print('Model run complete. Outputs: financial_model/housing_years.csv, financial_model/loan_schedule.csv, financial_model/gas_years.csv, financial_model/summary.csv')

# ----- generate LaTeX longtable snippets so the year-by-year estimates can be
# included directly into the LaTeX document (single-file PDF friendly)
def fmt(x, digits=2):
    try:
        return f"{x:,.{digits}f}"
    except Exception:
        return str(x)

def write_housing_tex(path, rows):
    out_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    total_revenue = sum(r['revenue'] for r in rows)
    total_post_tax = sum(r['post_tax_distributable'] for r in rows)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\\begin{longtable}{l r r r r r r r r r}\n')
        f.write('\\caption{Year-by-year housing P&L (USD) \\label{tab:housing_years}}\\\\n')
        f.write('\\toprule\\n')
        f.write('Year & Homes & Revenue & Rev\% & COGS & Gross & OpEx & Pre-tax & Tax & Post-tax\\\\\\n')
        f.write('\\midrule\\n')
        f.write('\\endfirsthead\\n')
        f.write('\\toprule Year & Homes & Revenue & Rev\% & COGS & Gross & OpEx & Pre-tax & Tax & Post-tax\\\\\\n')
        f.write('\\midrule\\n')
        f.write('\\endhead\\n')
        for r in rows:
            rev_pct = (r['revenue'] / total_revenue * 100) if total_revenue else 0
            post_tax_pct = (r['post_tax_distributable'] / total_post_tax * 100) if total_post_tax else 0
            f.write(f"{r['year']} & {r['homes_built']} & {fmt(r['revenue'])} & {fmt(rev_pct,2)}\\% & {fmt(r['cogs'])} & {fmt(r['gross_profit'])} & {fmt(r['opex'])} & {fmt(r['pre_tax'])} & {fmt(r['tax'])} & {fmt(r['post_tax_distributable'])}\\\\\\n")
        f.write('\\midrule\\n')
        f.write(f"Total & - & {fmt(total_revenue)} & 100.00\\% & {fmt(total_cogs)} & {fmt(total_gross)} & - & - & - & {fmt(total_post_tax)}\\\\\\n")
        f.write('\\bottomrule\\n')
        f.write('\\end{longtable}\\n')

def write_gas_tex(path, rows):
    out_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    total_rev = sum(r['total_rev'] for r in rows)
    total_post = sum(r['post_tax'] for r in rows)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\\begin{longtable}{l r r r r r r r r}\\n')
        f.write('\\caption{Year-by-year Halso gas P&L (USD) \\label{tab:gas_years}}\\\\n')
        f.write('\\toprule\\n')
        f.write('Year & Rev/home & Total Rev & Rev\% & COGS & OpEx & Pre-tax & Tax & Post-tax\\\\\\n')
        f.write('\\midrule\\n')
        f.write('\\endfirsthead\\n')
        f.write('\\toprule Year & Rev/home & Total Rev & Rev\% & COGS & OpEx & Pre-tax & Tax & Post-tax\\\\\\n')
        f.write('\\midrule\\n')
        f.write('\\endhead\\n')
        for r in rows:
            rev_pct = (r['total_rev'] / total_rev * 100) if total_rev else 0
            post_pct = (r['post_tax'] / total_post * 100) if total_post else 0
            f.write(f"{r['year']} & {fmt(r['rev_per_home'])} & {fmt(r['total_rev'])} & {fmt(rev_pct,2)}\\% & {fmt(r['cogs'])} & {fmt(r['opex'])} & {fmt(r['pre_tax'])} & {fmt(r['tax'])} & {fmt(r['post_tax'])}\\\\\\n")
        f.write('\\midrule\\n')
        f.write(f"Total & - & {fmt(total_rev)} & 100.00\\% & {fmt(sum(r['cogs'] for r in rows))} & {fmt(sum(r['opex'] for r in rows))} & - & - & {fmt(total_post)}\\\\\\n")
        f.write('\\bottomrule\\n')
        f.write('\\end{longtable}\\n')

try:
    write_housing_tex('housing_years_table.tex', housing_rows)
    write_gas_tex('gas_years_table.tex', gas_rows)
    print('Wrote LaTeX tables: housing_years_table.tex, gas_years_table.tex')
except Exception as e:
    print('Failed to write LaTeX tables:', e)
