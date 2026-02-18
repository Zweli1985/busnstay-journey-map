# Africoin App

A modern, full-featured web application for Africoin - a Solana-native, resource-backed stablecoin designed for BRICS cross-border trade and global settlements.

## Features

✨ **Core Functionality**
- **Wallet Integration** - Seamless Solana wallet connection (Phantom, Solflare, Torus)
- **Cross-Border Transfers** - Instant AFR transfers across BRICS nations
- **Payment Processing** - Credit card, wallet, and QR code payment options
- **Dashboard** - Real-time balance, transaction history, and AI analytics
- **Account Settings** - Security, preferences, and account management
- **Mobile Responsive** - Fully responsive on all devices

🔒 **Security & Compliance**
- PCI DSS compliant payment processing
- 256-bit SSL encryption
- 3D Secure authentication
- AI-powered fraud detection
- AML compliance ready

🎨 **Design**
- Dark theme with green/gold accents
- Glassmorphism effects
- Smooth animations and transitions
- Professional, modern UI

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables
- **Blockchain**: Solana Web3.js
- **Wallets**: Solana Wallet Adapter
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Payments**: Stripe integration ready

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Header.css
│   ├── Footer.tsx          # Footer component
│   └── Footer.css
├── pages/
│   ├── HomePage.tsx        # Landing page
│   ├── HomePage.css
│   ├── DashboardPage.tsx   # User dashboard
│   ├── DashboardPage.css
│   ├── TransferPage.tsx    # Cross-border transfers
│   ├── TransferPage.css
│   ├── PaymentPage.tsx     # Payment processing
│   ├── PaymentPage.css
│   ├── SettingsPage.tsx    # Account settings
│   └── SettingsPage.css
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
└── index.css               # Global styles
```

## Customization

### Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --green: #22c55e;
  --gold: #fbbf24;
  --text: #e5e7eb;
  /* ... more variables */
}
```

### Environment Variables
Create `.env.local`:
```
VITE_SOLANA_NETWORK=devnet
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Features Roadmap

- [x] Wallet integration
- [x] Cross-border transfers
- [x] Payment processing UI
- [x] Dashboard with analytics
- [x] Settings & preferences
- [ ] Real Stripe integration
- [ ] SPL token transfers
- [ ] Mobile app (React Native)
- [ ] QR code generation
- [ ] Merchant dashboard
- [ ] API backend integration

## API Integration

The app is ready to integrate with:
- **Stripe API** - For card payments
- **Solana RPC** - For blockchain operations
- **Custom Backend** - For user data and analytics

## Security Notes

- Never commit sensitive keys to repository
- Use environment variables for API keys
- Implement proper CORS policies
- Validate all user inputs
- Use HTTPS in production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and owned by Africoin Ltd.

## Support

For support, email support@africoin.co.za or visit the Africoin website.

## Deployed Application

This app is ready for deployment to:
- **Vercel** - Recommended for seamless React hosting
- **Netlify** - Great for static hosting
- **AWS Amplify** - For scalable deployments
- **GitHub Pages** - For static content

Simply connect your Git repository and follow deployment instructions.

---

Built with ❤️ for the BRICS economy. Africoin - Resource-Backed Stablecoin on Solana.
