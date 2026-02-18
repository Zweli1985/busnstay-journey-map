# Africoin App Setup Guide

## Quick Start

The Africoin app is a full-featured web application for resource-backed stablecoin payments and settlements on Solana.

### System Requirements
- **Node.js**: 16.0.0 or higher
- **npm**: 8.0.0 or higher (or yarn/pnpm)
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation Steps

#### 1. Open the folder in VS Code
```bash
# The folder isalready set up at:
# C:\Users\zwexm\LPSN\AFRICOIN-APP
```

#### 2. Install Dependencies
Open the integrated terminal in VS Code and run:

```bash
npm install
```

If you encounter peer dependency issues, try:
```bash
npm install --legacy-peer-deps
```

If npm fails, try yarn:
```bash
yarn install
```

#### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### Project Structure

```
AFRICOIN-APP/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── *.css
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TransferPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── *.css
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies
└── README.md             # Project documentation
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting (optional)
npm run lint
```

## Features Breakdown

### 1. **Home Page** (`/`)
- Hero section with Africoin overview
- Real-time metrics and pricing info
- Core services carousel
- Call-to-action buttons

### 2. **Dashboard** (`/dashboard`)
- Wallet balance display
- Transaction history
- Analytics and insights
- Risk scoring
- Collateral coverage

### 3. **Cross-Border Transfer** (`/transfer`)
- Instant AFR transfers
- BRICS country selection
- Ultra-low fee display
- Real-time conversion

### 4. **Payment Processing** (`/payment`)
- Credit card payment form
- Solana wallet integration
- QR code generation
- Multiple currency support

### 5. **Settings** (`/settings`)
- Account management
- Security & 2FA
- Notification preferences
- Display preferences

## Configuration

### Environment Variables
Create a `.env.local` file in the project root:

```env
# Solana Network (devnet, testnet, mainnet-beta)
VITE_SOLANA_NETWORK=devnet

# Stripe Public Key (for payments)
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# API Base URL (for backend integration)
VITE_API_URL=http://localhost:3000
```

### Customizing Colors
Edit the CSS variables in `src/index.css`:

```css
:root {
  --green: #22c55e;        /* Primary color */
  --gold: #fbbf24;         /* Accent color */
  --text: #e5e7eb;         /* Text color */
  /* ... more variables */
}
```

## Development Tips

### Hot Module Replacement (HMR)
Changes to your files will automatically refresh the browser - no manual reload needed!

### Component Development
Each component has its own CSS file for styling:
- `Header.tsx` + `Header.css`
- `Footer.tsx` + `Footer.css`
- Each page has its own CSS file

### Adding New Pages
1. Create `src/pages/NewPage.tsx`
2. Create `src/pages/NewPage.css`
3. Import in `App.tsx` and add route:
   ```tsx
   import NewPage from './pages/NewPage'
   // In Routes:
   <Route path="/new-page" element={<NewPage />} />
   ```

### Adding New Components
1. Create `src/components/ComponentName.tsx`
2. Create `src/components/ComponentName.css`
3. Import and use in other components

## Troubleshooting

### "Module not found" errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use
```bash
# Use a different port
npm run dev -- --port 3000
```

### TypeScript errors
```bash
# Check TypeScript compilation
npx tsc --noEmit
```

### Wallet connection issues
- Ensure Phantom or another Solana wallet is installed
- Check network is set to "Devnet" in wallet settings
- Try refreshing the page

## Building for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview

# The build output will be in the 'dist' folder
```

## Deployment

### Vercel (Recommended)
```bash
1. Connect your Git repository at vercel.com
2. Set build command: npm run build
3. Set output directory: dist
```

### Netlify
```bash
1. Connect your GitHub repo at netlify.com
2. Build command: npm run build
3. Publish directory: dist
```

### GitHub Pages
```bash
npm run build
# Push the dist folder to gh-pages branch
```

## Backend Integration

This app is ready to integrate with:
- **Stripe API** - For card payments
- **Solana RPC** - For blockchain operations
- **Custom API** - For user management and analytics

Update `VITE_API_URL` in `.env.local` to point to your backend.

## Security Best Practices

✅ **Do:**
- Keep private keys in `.env.local` (not committed)
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Keep dependencies updated

❌ **Never:**
- Commit `.env` files with secrets
- Expose private keys in code
- Trust unvalidated user input
- Use HTTP in production

## Performance Tips

- Uses Vite for fast development and optimized builds
- React Router for efficient client-side navigation
- CSS variables for theme switching
- Responsive design for all devices

## Next Steps

1. ✅ **Install & Run** - Follow installation steps above
2. 📝 **Customize** - Update colors, text, and branding
3. 🔗 **Integrate** - Connect Stripe and backend APIs
4. 📱 **Test** - Test on different devices/browsers
5. 🚀 **Deploy** - Push to production

## Support & Resources

- **Solana Web3.js Docs**: https://solana-labs.github.io/solana-web3.js/
- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Africoin Official**: https://africoin.trade

## License

This project is proprietary to Africoin Ltd. All rights reserved.

---

**Ready to get started?** Run `npm install && npm run dev` now! 🚀
