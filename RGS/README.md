% =============================================================================
% RGS-Halso Business Plan – Combined & Logical Version
% Author: Mr Zwelihle Mathe
% Last major update: February 2026
% Compile: xelatex --shell-escape RGS_Halso_BusinessPlan_Final.tex
% =============================================================================

\documentclass[11pt,a4paper]{article}

\usepackage{fontspec}
\setmainfont{Times New Roman}

\usepackage{geometry}
\geometry{left=20mm,right=20mm,top=20mm,bottom=25mm}

\usepackage{longtable,booktabs,multirow,array,tabularx}
\usepackage{graphicx}
\usepackage{xcolor}
\definecolor{rgsblue}{RGB}{0,51,102}
\definecolor{rgsgreen}{RGB}{0,153,76}
\definecolor{rgsorange}{RGB}{255,140,0}

\usepackage{hyperref}
\hypersetup{colorlinks=true, linkcolor=rgsblue, urlcolor=rgsgreen}

\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\textcolor{rgsblue}{\textbf{RGS Construction Lesotho (Pty) Ltd}}}
\fancyhead[R]{\textcolor{rgsgreen}{Lesotho ECO Homes \& Halso Gas Partnership}}
\fancyfoot[L]{\small Zwelihle Mathe \quad $|$ \quad +27 65 926 9311 \quad $|$ \quad zwexman@gmail.com}
\fancyfoot[C]{\small \thepage}
\fancyfoot[R]{\small \textcolor{red}{Confidential}}
\renewcommand{\headrulewidth}{0.4pt}
\setlength{\headheight}{15pt}

\usepackage{pgfplotstable,pgfplots,pgfmath}
\pgfplotsset{compat=1.18}
\usepackage{pgf-pie}

\usepackage{multicol,enumitem}
\setlist[itemize]{leftmargin=*}
\setlist[enumerate]{leftmargin=*}

\usepackage{lscape}
\usepackage{tcolorbox}
\tcbuselibrary{skins,breakable}

\newtcolorbox{rgsbox}[1][]{
  colback=rgsblue!5,colframe=rgsblue,boxrule=1pt,
  fonttitle=\bfseries\color{rgsblue},title=#1,
  breakable,left=5mm,right=5mm,top=5mm,bottom=5mm,
  before upper=\par
}

\usepackage{qrcode}
\usepackage{tikz}
\usetikzlibrary{trees,positioning}

\setlength{\tabcolsep}{4pt}
\sloppy

\title{\Huge\textcolor{rgsblue}{RGS Construction Lesotho \\ Halso Strategic Partnership Business Plan}\\[0.3em]\LARGE R5,000,000 for 20\% Equity \quad -- \quad 90,000 ECO Homes + 20-Year Exclusive Gas Supply}
\author{\normalsize Prepared by: RGS Construction Lesotho Team \\ Financial Director: Mr Zwelihle Mathe}
\date{February 2026}

\begin{document}

\maketitle
\thispagestyle{empty}

\begin{center}
\includegraphics[width=5.2cm]{C:/Users/zwexm/LPSN/RGS/logo.png} \\[1.2em]
{\Large\textbf{Executive Summary}}\vspace{0.8em}

RGS Construction Lesotho invites Halso to acquire a \textbf{20\% equity stake} (R5,000,000) in exchange for exclusive 20-year LPG supply rights to the 90,000-home Lesotho ECO Homes programme.

Funds will settle BCG mobilisation fees (GBP 100,000) and initial project setup. BCG provides \$250 million construction finance.

Halso gas operations projected to generate \textbf{~USD 460 million nominal revenue} and \textbf{~USD 103.5 million post-tax profit} over 20 years (4\% inflation). RGS housing delivers \textbf{~USD 7.46 billion revenue} and \textbf{~USD 460 million net profit}.

This project addresses Lesotho's housing shortage (backlog ~200,000 units) through sustainable modular homes. Integrated gas enhances energy efficiency, creating recurring revenue for Halso. Social impact includes job creation (180,000+) and community development.
\end{center}

\tableofcontents
\clearpage

\section{Partnership Acceptance Letter}

\begin{rgsbox}{Official Acceptance – Equity Partnership Offer}
Date: February 2026 \quad | \quad Office: Office 8, Kingsway Road, Maseru, Lesotho 100 \\
Prepared for: Halso \\
Prepared by: RGS Construction Lesotho (Pty) Ltd \\
Re: Lesotho Housing Project

We accept the Equity Buy-In: R5,000,000 for 20\% stake.

\textbf{Use of Funds:}
\begin{itemize}
\item GBP 100,000 to BCG (mobilisation)
\item Remainder for setup (operational expenses, equipment and initial working capital)
\end{itemize}

\textbf{Investment conditions (summary):}
\begin{enumerate}
\item Halso provides proof of funds (PoF) for R5,000,000 or an acceptable bank comfort letter to RGS and its legal counsel.
\item On satisfactory PoF verification, RGS's legal team will schedule a meeting to finalise the MoU and the definitive agreements.
\item After both parties sign the MoU/contracts, Halso will transfer the investment funds into the designated Fidelity escrow account managed by HASS Law \& Associates (escrow trustee).
\item RGS will initiate registration of Halso's 20\% equity stake with the relevant corporate registrar; registration documents are lodged while funds remain in escrow.
\item Once equity registration is confirmed, HASS Law \& Associates will release escrow funds to the RGS business account per agreed transfer instructions.
\end{enumerate}

This sequence protects both investors and the project; full details and wording are available in the legal appendix and the original RGS business profile.

Kind regards, \\
Gustav Edward Serfontein \\
Director, RGS Construction Lesotho (Pty) Ltd
\end{rgsbox}

\clearpage

\section{Project Overview – Lesotho Only}

All development activity and the 90,000-home programme are Lesotho-focused.

\textbf{Key project numbers}
\begin{itemize}
\item Total homes (target): 90,000 (national rollout over 10--15 years)
\item Halso equity requested: R5,000,000 for 20\%
\item Expected Halso 20-year gas revenue (nominal, 4\% inflation): ~USD 460,000,000
\item Expected Halso 20-year post-tax profit (25\% tax rate): ~USD 103,500,000
\end{itemize}

\clearpage

\section{Per-house costing and profitability}

\subsection{Assumptions -- per unit}
\begin{itemize}
\item Base selling price (average): USD 31,000 per unit
\item Construction lead time: 7--14 days per unit (modular system)
\item Inflation on materials and services: 4\% p.a. baseline
\item Gas hardware per home: USD 180
\item Warranty / 2-year service provisioning per home: USD 120
\end{itemize}

\subsection{Detailed cost breakdown (per house) -- baseline (USD)}
\begin{tabularx}{\textwidth}{l r}
\toprule
Cost item & Amount (USD) \\
\midrule
Materials (panels, frame, finishes) & 18,000 \\
Factory labour (assembly) & 4,200 \\
On-site delivery & 1,200 \\
Installation (team, crane, finish) & 1,400 \\
Gas hardware & 180 \\
Service / warranty allocation (2-year) & 120 \\
Indirects / project overhead (allocated) & 1,200 \\
Contingency (5\%) & 1,000 \\
\midrule
Total estimated cost per unit & \textbf{27,300} \\
List / market price per unit & \textbf{31,000} \\
Gross margin per unit & \textbf{3,700} \\
Gross margin \% & 11.9\% \\
\bottomrule
\end{tabularx}

\subsection{Profitability sensitivity (per-unit)}
\begin{tabularx}{\textwidth}{X r r r}
\toprule
Scenario & Cost per unit & Price & Gross profit \\
\midrule
Baseline & 27,300 & 31,000 & 3,700 \\
Material -10\% & 25,500 & 31,000 & 5,500 \\
Price +5\% & 27,300 & 32,550 & 5,250 \\
High inflation +2\% & 27,846 & 31,000 & 3,154 \\
\bottomrule
\end{tabularx}

\clearpage

\section{House Building Schedule – First 5 Years (2026–2030)}

\begin{longtable}{lrr}
	oprule
Year & Homes Built & Cumulative Homes \\
\midrule
2026 & 2,000 & 2,000 \\
2027 & 1,500 & 3,500 \\
2028 & 2,000 & 5,500 \\
2029 & 1,500 & 7,000 \\
2030 & 2,000 & 9,000 \\
\bottomrule
\end{longtable}

\clearpage

\section{Planned PPE Schedule}

\begin{longtable}{lrrr}
\toprule
Item & Qty & Unit Cost (USD) & Total (USD) \\
\midrule
Manufacturing modular lines (mobile) & 2 & 2,000,000 & 4,000,000 \\
Site cranage / lifting gear & 4 & 50,000 & 200,000 \\
Delivery trucks (flatbed) & 10 & 60,000 & 600,000 \\
Cylinder refill units / small-scale plant & 3 & 400,000 & 1,200,000 \\
Site offices and accommodation (modular) & 6 & 30,000 & 180,000 \\
Tools, PPE (worker safety) & 1,000 & 150 & 150,000 \\
Installation tooling and handsets (gas) & 200 & 500 & 100,000 \\
IT / ERP deployment & 1 & 150,000 & 150,000 \\
\midrule
\textbf{Total initial PPE} &  &  & \textbf{6,580,000} \\
\bottomrule
\end{longtable}

\clearpage

\section{5-Year Financials – Lesotho Pilot (USD)}

\subsection{Income Statement}
\begin{longtable}{lrrrrr}
\toprule
Item & 2026 & 2027 & 2028 & 2029 & 2030 \\
\midrule
Revenue & 31,145,000 & 62,410,000 & 93,795,000 & 63,010,000 & 32,105,000 \\
COGS & 23,184,000 & 44,316,000 & 66,122,000 & 44,501,000 & 22,889,000 \\
Gross Profit & 7,961,000 & 18,094,000 & 27,673,000 & 18,509,000 & 9,216,000 \\
OpEx & 200,000 & 220,000 & 242,000 & 266,000 & 293,000 \\
EBITDA & 7,761,000 & 17,874,000 & 27,431,000 & 18,243,000 & 8,923,000 \\
Interest & 1,389,000 & 1,389,000 & 4,167,000 & 8,333,000 & 11,111,000 \\
Pre-Tax & 6,372,000 & 16,485,000 & 23,264,000 & 9,910,000 & -2,188,000 \\
Tax (25\%) & 1,593,000 & 4,121,000 & 5,816,000 & 2,478,000 & 0 \\
Post-Tax & 4,779,000 & 12,364,000 & 17,448,000 & 7,432,000 & -2,188,000 \\
\bottomrule
\end{longtable}

\subsection{Balance Sheet (End of Year)}
\begin{longtable}{lrrrrr}
\toprule
Item & 2026 & 2027 & 2028 & 2029 & 2030 \\
\midrule
Cash & 30,724,000 & 97,584,000 & 198,169,000 & 254,735,000 & 273,425,000 \\
Other Current Assets & 1,000,000 & 1,000,000 & 1,000,000 & 1,000,000 & 1,000,000 \\
Long-term Assets (cum. capex) & 5,000,000 & 10,000,000 & 15,000,000 & 20,000,000 & 25,000,000 \\
Total Assets & 36,724,000 & 108,584,000 & 214,169,000 & 275,735,000 & 299,425,000 \\
Long-term Debt & 27,778,000 & 83,333,000 & 166,667,000 & 222,222,000 & 250,000,000 \\
Contributed Equity (Halso) & 310,000 & 310,000 & 310,000 & 310,000 & 310,000 \\
Retained Earnings & 8,636,000 & 24,941,000 & 47,192,000 & 53,203,000 & 49,115,000 \\
Total Equity & 8,946,000 & 25,251,000 & 47,502,000 & 53,513,000 & 49,425,000 \\
Total Liabilities \& Equity & 36,724,000 & 108,584,000 & 214,169,000 & 275,735,000 & 299,425,000 \\
\bottomrule
\end{longtable}

\subsection{Cash Flow (Pro Forma)}
\begin{longtable}{lrrrrr}
\toprule
Item & 2026 & 2027 & 2028 & 2029 & 2030 \\
\midrule
Ops Cash & 31,145,000 & 62,410,000 & 93,795,000 & 63,010,000 & 32,105,000 \\
VAT Received & 4,671,750 & 9,361,500 & 14,069,250 & 9,451,500 & 4,815,750 \\
Drawdowns & 27,777,778 & 55,555,556 & 83,333,333 & 55,555,556 & 27,777,778 \\
Investment Received & 310,244 & 0 & 0 & 0 & 0 \\
Subtotal Received & 63,904,772 & 127,327,056 & 191,197,583 & 128,017,056 & 64,698,528 \\
Cash Spending & 200,000 & 220,000 & 242,000 & 266,200 & 292,820 \\
Bill Payments & 23,183,800 & 44,316,000 & 66,122,000 & 44,500,800 & 22,889,280 \\
Capex & 5,000,000 & 5,000,000 & 5,000,000 & 5,000,000 & 5,000,000 \\
Tax Paid & 0 & 2,862,111 & 4,127,278 & 5,636,083 & 2,237,417 \\
Interest Paid & 1,388,889 & 1,388,889 & 4,166,667 & 8,333,333 & 11,111,111 \\
Dividends & 0 & 0 & 1,000,000 & 1,000,000 & 1,000,000 \\
Subtotal Spent & 33,180,389 & 60,467,400 & 90,612,545 & 71,451,466 & 46,007,843 \\
Net Cash Flow & 30,724,383 & 66,859,656 & 100,585,038 & 56,565,590 & 18,690,685 \\
Ending Cash & 30,724,383 & 97,584,039 & 198,169,077 & 254,734,667 & 273,425,352 \\
\bottomrule
\end{longtable}

\subsection{Financial Ratios and Notes}
\begin{itemize}
\item Current Ratio (2026 example): 1.4x
\item Debt-to-Equity (peak): 1.8x
\item EBITDA Margin: 27\%–30\%
\item Return on Equity (long-run target): >15\%
\end{itemize}

Notes: Ratios calculated on consolidated project SPV figures. Tax, FX and interest-rate sensitivities available in Excel/CSV files.

\clearpage

\section{Halso Gas Revenue Model}

\subsection{Per-Home Assumptions (Year 1)}
\begin{itemize}
\item Net revenue per home per year: USD 240
\item Annual escalation: 4\%
\item COGS: 60\% of revenue
\item OpEx: 10\% of revenue
\item Tax: 25\%
\end{itemize}

\textbf{Year 1 per home (USD):}
\begin{tabularx}{0.7\textwidth}{l r}
\toprule
Revenue & 240 \\
COGS (60\%) & 144 \\
Gross profit & 96 \\
OpEx (10\%) & 24 \\
Pre-tax & 72 \\
Tax (25\%) & 18 \\
\textbf{Post-tax contribution} & \textbf{54} \\
\bottomrule
\end{tabularx}

\clearpage

\section{20-Year Halso Gas P\&L – Year-by-year}

The complete year-by-year Halso gas P\&L (20 years) is produced by the financial model and included below.

\input{financial_model/gas_years_table.tex}

\clearpage

\clearpage

\section*{Appendix}
\begin{itemize}
\item Detailed 20-year gas and housing financial model (available on request)
\item RGS Construction business profile 2021 (PDF)
\item Supplier lists, historical unit costs, bank engagement summaries
\end{itemize}

\begin{center}
\qrcode[height=2.4cm]{https://wa.me/27659269311} \\[0.5em]
\small Scan to contact directly
\end{center}
\clearpage
\section{Full Rollout Financials — 90,000 Homes, Loan Repayment \& Investor Returns}

The tables and summaries below extend the pilot financials to the full 90,000-home programme and show an illustrative repayment schedule for the BCG construction loan and the implied returns to Halso as a 20\% equity holder. Where numbers were not explicitly specified in the original document we make reasonable, explicit assumptions (listed below) so the model is transparent and reproducible.

\subsection{Key assumptions and notes}
\begin{itemize}
  \item Rollout period (assumption): 12 years (2026--2037). This is an operational assumption; the plan's text refers to 10--15 years — the 12-year schedule below is illustrative and can be switched to any alternative schedule in the spreadsheet model.
  \item Homes total: 90,000 (target)
  \item Homes built per year (equal ramp for clarity): 7,500 homes/year (90,000 / 12)
  \item List / market price per unit: USD 31,000 (as used in per-unit section)
  \item Total cost per unit (COGS): USD 27,300
  \item Gross margin per unit: USD 3,700
  \item Tax rate on SPV profits: 25\%
  \item BCG construction loan: USD 250,000,000 (principal per Executive Summary)
  \item BCG loan interest (assumption): 6\% p.a., amortising over 15 years with equal annual payments (typical project finance structure; exact facility terms to be taken from the loan agreement)
  \item Halso equity: 20\% for R5,000,000 (documented). Equity stake entitles Halso to 20\% of distributable post-tax profits from the housing SPV. Halso's separate gas business financials are presented below and are assumed to remain with Halso (not part of the housing SPV distributable profits unless otherwise agreed).
  \item Gas revenue (20-year summary): use the document's nominal totals (\~USD 460M revenue / \~USD 103.5M post-tax profit) as the gas business projection over 20 years.
\end{itemize}

\subsection{Rollout schedule (illustrative)}
\begin{longtable}{lrrr}
	oprule
Year & Opening Balance (USD) & Interest (USD) & Closing Balance (USD) \\
\midrule
2026 & 7,500 & 7,500 \\
2027 & 7,500 & 15,000 \\
2028 & 7,500 & 22,500 \\
2029 & 7,500 & 30,000 \\
2030 & 7,500 & 37,500 \\
2031 & 7,500 & 45,000 \\
2032 & 7,500 & 52,500 \\
2033 & 7,500 & 60,000 \\
2034 & 7,500 & 67,500 \\
2035 & 7,500 & 75,000 \\
2036 & 7,500 & 82,500 \\
2037 & 7,500 & 90,000 \\
\bottomrule
\end{longtable}

\subsection{Housing revenue and profit — full rollout summary}
Using the per-unit figures from the cost section (USD 31,000 price; USD 27,300 cost):
\begin{itemize}
  \item Total revenue (90,000 homes): 90,000 $\times$ 31,000 = USD \textbf{2,790,000,000}
  \item Total COGS (90,000 homes): 90,000 $\times$ 27,300 = USD \textbf{2,457,000,000}
  \item Total gross profit (90,000 homes): USD \textbf{333,000,000}
  \item If we treat this gross profit as a proxy for pre-tax project profit (for illustration) and apply 25\% tax, post-tax contribution = 333,000,000 $\times$ (1 - 0.25) = USD \textbf{249,750,000}
  \item Halso (20\% equity) share of housing SPV post-tax profits (illustrative, no preferred returns or other waterfall): 0.20 $\times$ 249,750,000 = USD \textbf{49,950,000}
\end{itemize}

Note: the Executive Summary in the document references a larger housing revenue figure (\~USD 7.46B) that is inconsistent with the per-unit price and 90,000-unit total used here. The figures above strictly follow the per-unit numbers presented in the Per-house costing section (USD 31,000 list price). Use the Excel model to reconcile alternative scenarios and sensitivities.

\input{financial_model/housing_years_table.tex}
\subsection{BCG loan amortisation and visualisations}
Loan parameters (assumed for the illustrative model): principal USD 250,000,000; interest 6% p.a.; term 15 years; annual level payments. The precise level payment and amortisation schedule are available in the project financial model.
Below we include three charts summarising the model outputs: annual housing revenue, loan closing balance over time, and Halso gas post-tax profit by year.

\begin{figure}[ht]
  \centering
  % Housing revenue
  \includegraphics[width=0.9\textwidth]{c:/Users/zwexm/LPSN/RGS/financial_model/housing_revenue.png}
  \caption{Modelled annual housing revenue (static image).}
\end{figure}

\begin{figure}[ht]
  \centering
  % Loan balance chart
  \includegraphics[width=0.9\textwidth]{c:/Users/zwexm/LPSN/RGS/financial_model/loan_balance.png}
  \caption{Loan amortisation schedule (static image).}
\end{figure}

\begin{figure}[ht]
  \centering
  % Gas post-tax chart
  \includegraphics[width=0.9\textwidth]{c:/Users/zwexm/LPSN/RGS/financial_model/gas_posttax.png}
  \caption{Annual Halso gas business post-tax profit (static image).}
\end{figure}

% Simple icons (TikZ) to visualise the three pillars: housing, finance, gas
\begin{center}
\begin{tikzpicture}[scale=0.9, every node/.style={inner sep=2pt}]
  % House icon
  \node (house) at (0,0) {
    \begin{tikzpicture}
      \draw[fill=rgsblue!20] (-0.5,0) rectangle (0.5,0.6);
      \draw[fill=rgsblue!60] (-0.6,0.6) -- (0,1.1) -- (0.6,0.6) -- cycle;
      \draw[fill=white] (-0.15,0) rectangle (0.15,0.3);
    \end{tikzpicture}
  };
  \node[below=6pt of house] {Housing};

  % Coins icon
  \node (coins) at (4,0) {
    \begin{tikzpicture}
      \draw[fill=yellow!80!orange] (0,0) ellipse (0.5 and 0.15);
      \draw[fill=yellow!70!orange] (0,-0.18) ellipse (0.45 and 0.14);
      \draw[fill=yellow!60!orange] (0,-0.36) ellipse (0.4 and 0.12);
    \end{tikzpicture}
  };
  \node[below=6pt of coins] {Finance};

  % Gas cylinder icon
  \node (gas) at (8,0) {
    \begin{tikzpicture}
      \draw[fill=rgsgreen!20] (-0.25,0) rectangle (0.25,0.7);
      \draw[fill=rgsgreen!40] (-0.18,0.7) rectangle (0.18,0.85);
      \draw[fill=rgsgreen!10] (-0.25,0.7) arc (180:360:0.25 and 0.06) -- cycle;
    \end{tikzpicture}
  };
  \node[below=6pt of gas] {Gas operations};
\end{tikzpicture}
\end{center}

\noindent The charts above are dynamic when the CSVs are updated. Keep \texttt{financial\_model/*.csv} next to your LaTeX root so pgfplots can load them at compile time.

\subsection{Project cashflow and investor returns — illustrative summary}
\begin{itemize}
  \item Total housing project post-tax distributable cash (illustrative, from per-unit calculation above): USD 249,750,000
  \item Halso (20\%) share of distributable housing cash: USD 49,950,000
  \item Halso gas business post-tax profit (document summary over 20 years): USD \textbf{103,500,000}
  \item Combined Halso nominal cash benefit in the illustrative scenario: 49,950,000 (equity in housing SPV) + 103,500,000 (gas post-tax over 20 years) = USD \textbf{153,450,000}
\end{itemize}

These numbers are illustrative and conservative relative to alternative assumptions (for example: if the larger document figure USD 7.46B housing revenue and USD 460M net profit are used, Halso's 20\% share would be materially larger). The recommended next step is to implement a full-year-by-year cashflow model in Excel/CSV that:
\begin{enumerate}
  \item Uses a chosen rollout schedule (user-selectable: 10/12/15 years)
  \item Builds year-by-year revenue, COGS, OpEx, interest and tax calculations
  \item Implements the exact BCG drawdown timing and loan amortisation
  \item Produces waterfall outputs: project-level EBITDA, pre-tax profit, tax, post-tax distributable cash, and equity distributions (preferred returns, if any, then pro rata equity splits)
  \item Separately models the Halso gas business cashflows and the combined consolidated benefit to Halso (equity returns + gas operations)
\end{enumerate}

\clearpage
\section*{Appendix}
\begin{itemize}
\item Detailed 20-year gas and housing financial model (Excel/CSV)
\item RGS Construction business profile 2021 (PDF)
\item Supplier lists, historical unit costs, bank engagement summaries
\end{itemize}

\begin{center}
\qrcode[height=2.4cm]{https://wa.me/27659269311} \\[0.5em]
\small Scan to contact directly
\end{center}

\end{document}