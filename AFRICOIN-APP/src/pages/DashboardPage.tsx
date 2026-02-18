import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './DashboardPage.css'

interface Transaction {
  id: string
  type: 'send' | 'receive'
  amount: number
  date: string
  address: string
  currency: string
  status: 'completed' | 'pending' | 'failed'
  description?: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedWallet, setSelectedWallet] = useState(user?.wallets[0]?.id || 'wallet_1')
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'receive',
      amount: 100,
      currency: 'AFR',
      date: '2026-02-18',
      address: '3xML9dK...B7Ym',
      status: 'completed',
      description: 'Payment received from merchant'
    },
    {
      id: '2',
      type: 'send',
      amount: 50,
      currency: 'AFR',
      date: '2026-02-17',
      address: '9dLxP2...K2Pq',
      status: 'completed',
      description: 'Transfer to friend'
    },
    {
      id: '3',
      type: 'receive',
      amount: 250,
      currency: 'AFR',
      date: '2026-02-15',
      address: '5tRwN...N9Wx',
      status: 'pending',
      description: 'Cross-border payment from Brazil'
    },
    {
      id: '4',
      type: 'send',
      amount: 25.50,
      currency: 'ETH',
      date: '2026-02-14',
      address: '0x742d...bc',
      status: 'completed',
      description: 'Ethereum transfer'
    },
    {
      id: '5',
      type: 'receive',
      amount: 500,
      currency: 'AFR',
      date: '2026-02-10',
      address: 'Merchant...123',
      status: 'completed',
      description: 'Payment for services'
    },
  ])

  const currentWallet = user?.wallets.find(w => w.id === selectedWallet) || user?.wallets[0]
  const walletTransactions = transactions.filter(tx => {
    if (currentWallet?.currency === 'AFR') return tx.currency === 'AFR'
    if (currentWallet?.currency === 'ETH') return tx.currency === 'ETH'
    return true
  })

  const totalBalance = user?.wallets.reduce((sum, w) => sum + w.balance, 0) || 0

  return (
    <div className="page-wrap">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back! Here's your Africoin portfolio overview.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="dashboard-overview">
        <div className="card overview-card">
          <div className="card-label">Total Balance</div>
          <div className="card-value">
            <i className="fas fa-coins"></i>
            {totalBalance.toFixed(2)}
          </div>
          <div className="card-sub">Across all wallets</div>
        </div>

        <div className="card overview-card">
          <div className="card-label">24h Change</div>
          <div className="card-value positive">
            <i className="fas fa-arrow-up"></i>
            +2.5%
          </div>
          <div className="card-sub">+${(totalBalance * 0.025).toFixed(2)} USD</div>
        </div>

        <div className="card overview-card">
          <div className="card-label">Transactions</div>
          <div className="card-value">
            <i className="fas fa-exchange-alt"></i>
            {transactions.length}
          </div>
          <div className="card-sub">This month</div>
        </div>

        <div className="card overview-card">
          <div className="card-label">Verification Status</div>
          <div className={`card-value ${user?.kycStatus === 'verified' ? 'verified' : 'pending'}`}>
            <i className={user?.kycStatus === 'verified' ? 'fas fa-check-circle' : 'fas fa-clock'}></i>
            {user?.kycStatus === 'verified' ? 'Verified' : 'Pending'}
          </div>
          <div className="card-sub">KYC Status</div>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="wallets-container">
        <h2>My Accounts</h2>
        <div className="wallets-grid">
          {user?.wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`wallet-card ${selectedWallet === wallet.id ? 'selected' : ''}`}
              onClick={() => setSelectedWallet(wallet.id)}
            >
              <div className="wallet-header">
                <div className="wallet-type-icon">
                  {wallet.type === 'solana' && <i className="fas fa-rocket"></i>}
                  {wallet.type === 'ethereum' && <i className="fab fa-ethereum"></i>}
                  {wallet.type === 'other' && <i className="fas fa-wallet"></i>}
                </div>
                <div className="wallet-status">
                  {wallet.walletProvider && (
                    <span className="provider-badge">
                      <i className="fas fa-check-circle"></i>
                      {wallet.walletProvider}
                    </span>
                  )}
                </div>
              </div>

              <div className="wallet-details">
                <h3>{wallet.name}</h3>
                <p className="wallet-addr">{wallet.address.substring(0, 20)}...</p>
              </div>

              <div className="wallet-balance">
                <span className="amount">{wallet.balance.toFixed(2)}</span>
                <span className="currency">{wallet.currency}</span>
              </div>

              {selectedWallet === wallet.id && (
                <div className="selected-indicator">
                  <i className="fas fa-check"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Account Info */}
      {currentWallet && (
        <div className="card current-account">
          <h2>{currentWallet.name}</h2>
          <div className="account-details">
            <div className="detail-item">
              <span className="label">Full Address</span>
              <span className="value mono">{currentWallet.address}</span>
              <button className="copy-btn" onClick={() => {
                navigator.clipboard.writeText(currentWallet.address)
                alert('Address copied!')
              }}>
                <i className="fas fa-copy"></i>
              </button>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <span className="label">Account Type</span>
                <span className="value">{currentWallet.type.toUpperCase()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Balance</span>
                <span className="value highlight">{currentWallet.balance.toFixed(2)} {currentWallet.currency}</span>
              </div>
              <div className="detail-item">
                <span className="label">USD Value</span>
                <span className="value">${(currentWallet.balance * 1.0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="transactions-container card">
        <div className="transactions-header">
          <h2>Recent Transactions</h2>
          <button className="btn-secondary" disabled>
            <i className="fas fa-download"></i>
            Export CSV
          </button>
        </div>

        {walletTransactions.length > 0 ? (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Address</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {walletTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className={`type-badge ${tx.type}`}>
                        <i className={tx.type === 'send' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}></i>
                        {tx.type === 'send' ? 'Sent' : 'Received'}
                      </span>
                    </td>
                    <td className={tx.type === 'send' ? 'negative' : 'positive'}>
                      {tx.type === 'send' ? '-' : '+'}
                      {tx.amount.toFixed(2)} {tx.currency}
                    </td>
                    <td className="address mono">{tx.address}</td>
                    <td className="description">{tx.description || '-'}</td>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${tx.status}`}>
                        {tx.status === 'completed' && <i className="fas fa-check-circle"></i>}
                        {tx.status === 'pending' && <i className="fas fa-hourglass-half"></i>}
                        {tx.status === 'failed' && <i className="fas fa-times-circle"></i>}
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-transactions">
            <i className="fas fa-history"></i>
            <p>No transactions yet</p>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="analytics-section">
        <h2>Analytics</h2>
        <div className="analytics-grid">
          <div className="card analytics-card">
            <h3>Send</h3>
            <div className="stat-value">
              {transactions.filter(tx => tx.type === 'send').reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
            </div>
            <p className="stat-label">{transactions.filter(tx => tx.type === 'send').length} transactions</p>
          </div>

          <div className="card analytics-card">
            <h3>Receive</h3>
            <div className="stat-value">
              {transactions.filter(tx => tx.type === 'receive').reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
            </div>
            <p className="stat-label">{transactions.filter(tx => tx.type === 'receive').length} transactions</p>
          </div>

          <div className="card analytics-card">
            <h3>Net Flow</h3>
            <div className="stat-value">
              {(transactions.filter(tx => tx.type === 'receive').reduce((sum, tx) => sum + tx.amount, 0) -
                transactions.filter(tx => tx.type === 'send').reduce((sum, tx) => sum + tx.amount, 0)).toFixed(2)}
            </div>
            <p className="stat-label">Total inflow - outflow</p>
          </div>

          <div className="card analytics-card">
            <h3>Avg Transaction</h3>
            <div className="stat-value">
              {(transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length).toFixed(2)}
            </div>
            <p className="stat-label">Average per transaction</p>
          </div>
        </div>
      </div>
    </div>
  )
}
