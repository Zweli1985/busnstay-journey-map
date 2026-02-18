#!/usr/bin/env node

/**
 * Africoin App Setup Script
 * Run this script to install dependencies and start the development server
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Africoin App Setup\n');

try {
  const cwd = path.resolve(__dirname);
  console.log(`📁 Working directory: ${cwd}\n`);

  // Check if node_modules exists
  const nodeModulesPath = path.join(cwd, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    try {
      execSync('npm install', { cwd, stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully!\n');
    } catch (err) {
      console.error('❌ Failed to install dependencies');
      console.error(err.message);
      setTimeout(() => {
        console.log('\n⚠️  Trying alternative install method...');
        execSync('npm install --legacy-peer-deps --no-save @ solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets', { cwd, stdio: 'inherit' });
      }, 1000);
    }
  } else {
    console.log('✅ Dependencies already installed\n');
  }

  // Start dev server
  console.log('🎉 Starting development server...\n');
  console.log('📍 Open your browser to: http://localhost:5173\n');
  
  execSync('npm run dev', { cwd, stdio: 'inherit' });
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
