# Africoin App - Development Instructions

## Project Overview

A complete, production-ready React + TypeScript web application for Africoin blockchain payment platform.

### Core Features
- **Solana Wallet Integration** - Phantom, Solflare, Torus wallets
- **Payment Processing** - Credit card, wallet, and QR code options  
- **Cross-Border Transfers** - BRICS-focused instant settlements
- **Dashboard & Analytics** - Real-time balance, transactions, AI insights
- **Account Settings** - Security, preferences, notification management
- **Mobile Responsive** - Works seamlessly on all devices

### Technology Stack
- React 18 + TypeScript
- Vite (ultra-fast build tool)
- Solana Web3.js + Wallet Adapter
- React Router DOM
- CSS3 with CSS Variables
- Responsive design (mobile-first)

## Setup Progress

- [x] Verify copilot-instructions.md file created
- [x] Clarify project requirements
- [x] Scaffold project structure and files
- [x] Create all component files with styling
- [x] Implement routing and navigation
- [x] Build dashboard with transaction history
- [x] Create payment processing pages
- [x] Build settings/account management
- [x] Create documentation (README + SETUP guide)
- [ ] Install dependencies via npm
- [ ] Verify project runs locally
- [ ] Test all features

## Installation & Running

### Step 1: Install Dependencies
```bash
npm install
# or if issues: npm install --legacy-peer-deps
```

### Step 2: Start Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Step 3: Build for Production
```bash
npm run build
```

## Project File Structure

```
src/
├── components/
│   ├── Header.tsx       - Navigation with wallet connect
│   ├── Footer.tsx       - Footer branding
│   └── *.css            - Component styles
├── pages/
│   ├── HomePage.tsx     - Landing page hero + services
│   ├── DashboardPage.tsx - Balance, transactions, analytics
│   ├── TransferPage.tsx - Cross-border payment form
│   ├── PaymentPage.tsx  - Card/wallet/QR payments
│   ├── SettingsPage.tsx - Account & security settings
│   └── *.css            - Page styles
├── App.tsx              - Main routing component
├── main.tsx             - React DOM render entry
└── index.css            - Global styles + CSS vars
```

## Styling Details

### Color Palette
- Primary: `--green: #22c55e` - Action buttons, highlights
- Accent: `--gold: #fbbf24` - Secondary elements, gradients
- Text: `--text: #e5e7eb` - Primary text
- Muted: `--text-muted: #9ca3af` - Secondary text

### Theme Features
- Dark background with gradient overlay
- Glassmorphism effects (backdrop-filter blur)
- Smooth transitions and animations
- Responsive breakpoints (960px, 640px)
- Accessible color contrast

## Key Files

- **README.md** - Full project documentation
- **SETUP.md** - Detailed setup and troubleshooting guide  
- **vite.config.ts** - Build configuration
- **tsconfig.json** - TypeScript configuration
- **package.json** - Dependencies and scripts

## Next Steps After Setup

1. Run `npm install` to install all dependencies
2. Run `npm run dev` to start the development server
3. Open http://localhost:5173 in your browser
4. Connect your Solana wallet to test features
5. Customize colors, text, and branding as needed
6. Integrate with Stripe API for real payments
7. Deploy to Vercel, Netlify, or your preferred platform

## Customization Guide

### Change Colors
Edit `src/index.css` CSS variables

### Add New Pages
1. Create `src/pages/PageName.tsx`
2. Create `src/pages/PageName.css`
3. Add route in `App.tsx`

### Change Network
In `App.tsx`, update:
```tsx
const network = WalletAdapterNetwork.Mainnet // Change from Devnet
```

## Troubleshooting

If npm install fails:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

If port 5173 is in use:
```bash
npm run dev -- --port 3000
```

See SETUP.md for more detailed troubleshooting.
