import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'status-verified'
      case 'in-progress':
        return 'status-progress'
      case 'rejected':
        return 'status-rejected'
      default:
        return 'status-pending'
    }
  }

  const getKYCStatusLabel = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified'
      case 'in-progress':
        return 'In Progress'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending'
    }
  }

  const getKYCStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return 'fas fa-check-circle'
      case 'in-progress':
        return 'fas fa-hourglass-half'
      case 'rejected':
        return 'fas fa-times-circle'
      default:
        return 'fas fa-clock'
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="page-wrap">
      <div className="profile-header">
        <div className="profile-header-content">
          <h1>My Profile</h1>
          <p>Manage your account and verification status</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>

      <div className="profile-grid">
        {/* Overview Card */}
        <div className="card profile-overview">
          <div className="overview-top">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <h2>{user?.firstName} {user?.lastName}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="overview-stats">
            <div className="stat">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Wallets</span>
              <span className="stat-value">{user?.wallets.length || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Balance</span>
              <span className="stat-value">
                <i className="fas fa-coins"></i>
                {user?.wallets.reduce((sum, w) => sum + w.balance, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* KYC Status */}
        <div className="card kyc-status-card">
          <div className="status-header">
            <h3>Verification Status</h3>
            <div className={`status-badge ${getKYCStatusColor(user?.kycStatus || 'pending')}`}>
              <i className={getKYCStatusIcon(user?.kycStatus || 'pending')}></i>
              {getKYCStatusLabel(user?.kycStatus || 'pending')}
            </div>
          </div>

          <div className="status-info">
            {user?.kycStatus === 'verified' && (
              <>
                <p className="status-description">
                  <i className="fas fa-check-circle"></i>
                  Your identity has been verified. You have full access to all platform features.
                </p>
                {user.kycApprovalDate && (
                  <p className="approval-date">
                    Approved on {new Date(user.kycApprovalDate).toLocaleDateString()}
                  </p>
                )}
              </>
            )}
            {user?.kycStatus === 'in-progress' && (
              <p className="status-description">
                <i className="fas fa-hourglass-half"></i>
                Your KYC verification is in progress. We'll notify you once it's complete.
              </p>
            )}
            {user?.kycStatus === 'pending' && (
              <div className="pending-action">
                <p className="status-description">
                  <i className="fas fa-clock"></i>
                  Complete your KYC verification to unlock all features.
                </p>
                <Link to="/kyc" className="btn-primary">
                  Start Verification
                </Link>
              </div>
            )}
            {user?.kycStatus === 'rejected' && (
              <p className="status-description error">
                <i className="fas fa-times-circle"></i>
                Your KYC was not approved. Please contact support.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Wallets Section */}
      <div className="card wallets-section">
        <div className="section-header">
          <h3>My Wallets & Accounts</h3>
          <button className="btn-secondary" disabled>
            <i className="fas fa-plus"></i>
            Add Wallet
          </button>
        </div>

        {user?.wallets && user.wallets.length > 0 ? (
          <div className="wallets-grid">
            {user.wallets.map((wallet) => (
              <div key={wallet.id} className="wallet-card">
                <div className="wallet-icon">
                  {wallet.type === 'solana' && <i className="fab fa-ethereum" style={{color: '#14F195'}}></i>}
                  {wallet.type === 'ethereum' && <i className="fab fa-ethereum" style={{color: '#627EEA'}}></i>}
                  {wallet.type === 'other' && <i className="fas fa-wallet"></i>}
                </div>

                <div className="wallet-info">
                  <h4>{wallet.name}</h4>
                  <p className="wallet-address">{wallet.address.substring(0, 16)}...</p>
                  <p className="wallet-provider">
                    {wallet.walletProvider ? (
                      <>
                        <i className="fas fa-check-circle"></i>
                        {wallet.walletProvider.charAt(0).toUpperCase() + wallet.walletProvider.slice(1)}
                      </>
                    ) : (
                      'Manual Entry'
                    )}
                  </p>
                </div>

                <div className="wallet-balance">
                  <span className="balance-amount">
                    {wallet.balance.toFixed(2)}
                  </span>
                  <span className="balance-currency">{wallet.currency}</span>
                </div>

                <button className="wallet-action">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-wallet"></i>
            <p>No wallets connected yet</p>
            <button className="btn-primary" disabled>
              <i className="fas fa-plus"></i>
              Connect Your First Wallet
            </button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="card personal-info">
        <h3>Personal Information</h3>

        <div className="info-grid">
          <div className="info-item">
            <label>Full Name</label>
            <span>{user?.firstName} {user?.lastName}</span>
          </div>
          <div className="info-item">
            <label>Email</label>
            <span>{user?.email}</span>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <span>{user?.phone || 'Not provided'}</span>
          </div>
          <div className="info-item">
            <label>Account Status</label>
            <span>{user?.verified ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        <div className="edit-button">
          <button className="btn-secondary" disabled>
            <i className="fas fa-edit"></i>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card security-settings">
        <h3>Security Settings</h3>

        <div className="security-items">
          <div className="security-item">
            <div className="security-info">
              <i className="fas fa-shield-alt"></i>
              <div>
                <h4>Password</h4>
                <p>Change your password regularly to keep your account secure</p>
              </div>
            </div>
            <button className="btn-secondary" disabled>Change</button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <i className="fas fa-mobile-alt"></i>
              <div>
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
            </div>
            <button className="btn-secondary" disabled>Setup</button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <i className="fas fa-history"></i>
              <div>
                <h4>Login Activity</h4>
                <p>View your recent login history and active sessions</p>
              </div>
            </div>
            <button className="btn-secondary" disabled>View</button>
          </div>
        </div>
      </div>
    </div>
  )
}
