import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Header from './components/Header'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import TransferPage from './pages/TransferPage'
import PaymentPage from './pages/PaymentPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import KYCPage from './pages/KYCPage'
import TransactionProcessingPage from './pages/TransactionProcessingPage'

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="bg-orb"></div>
      <div className="bg-orb-2"></div>

      {isAuthenticated && <Header />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* KYC Route (accessible for unauthenticated users during registration) */}
          <Route path="/kyc" element={isAuthenticated ? <KYCPage /> : <Navigate to="/login" />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transfer" element={<TransferPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/transactions" element={<TransactionProcessingPage />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </main>

      {isAuthenticated && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
