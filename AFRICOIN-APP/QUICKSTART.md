# 🚀 AFRICOIN APP - QUICK START GUIDE

## ✅ VS Code Terminal (You're Here!)

Great! VS Code is now open with your Africoin app folder. Here's what to do next:

### Step 1: Open Integrated Terminal 
- Press `` Ctrl + ` `` (backtick) to open the terminal
- Or go to: **Terminal → New Terminal**

### Step 2: Install Dependencies
Copy and paste this command into the VS Code terminal:

```bash
npm install
```

**If you get peer dependency warnings, use:**
```bash
npm install --legacy-peer-deps
```

**Wait 3-5 minutes for installation to complete.** You should see:
- `✓ packages resolved`
- `+ added XXX packages`

### Step 3: Start Development Server
Once installation finishes, run:

```bash
npm run dev
```

You should see output like:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: View Your App
Open your browser and go to:
- **http://localhost:5173**

🎉 Your Africoin app is live!

---

## 📋 Features You Can Test

1. **Home Page** - See the landing page with hero and services
2. **Connect Wallet** - Click wallet button (needs Phantom/Solflare installed)
3. **Dashboard** - View balance and transactions (requires wallet)
4. **Transfer** - Test cross-border payment form
5. **Payment** - Try credit card/wallet/QR payment tabs
6. **Settings** - Configure account preferences

---

## 🛠️ Troubleshooting

### "npm command not found"
- Make sure Node.js is installed: `node --version`
- If not, download from https://nodejs.org/

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Clean install
rm -r node_modules
rm package-lock.json
npm install
```

### Still stuck?
1. Check the **Problems** tab in VS Code (Ctrl+Shift+M)
2. Look at **Output** panel for error details
3. See full **SETUP.md** documentation in project folder

---

## 📂 Project Files to Customize

- **Colors/Theme:** `src/index.css` (CSS variables at top)
- **Home Page:** `src/pages/HomePage.tsx`
- **Dashboard:** `src/pages/DashboardPage.tsx`
- **Add New Page:** Create file in `src/pages/MyPage.tsx`

---

## 🚀 Build for Production

When ready to deploy:

```bash
npm run build
```

This creates a `dist` folder ready for Vercel, Netlify, or any host.

---

## 📚 Full Documentation

- **README.md** - Complete feature list and API integration
- **SETUP.md** - Detailed setup & customization guide

---

**Questions?** Check copilot-instructions.md for development guidelines.

**Let's build Africoin! 🚀**
