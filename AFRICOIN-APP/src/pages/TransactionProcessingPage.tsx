import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TransactionProcessingPage.css'

interface ProcessingTransaction {
  id: string
  type: 'send' | 'receive' | 'payment'
  amount: number
  currency: string
  recipient: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
}

export default function TransactionProcessingPage() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<ProcessingTransaction[]>([
    {
      id: 'txn_001',
      type: 'send',
      amount: 250,
      currency: 'AFR',
      recipient: 'merchant@example.com',
      description: 'Payment to online store',
      status: 'completed',
      createdAt: '2026-02-18T10:30:00Z',
      completedAt: '2026-02-18T10:32:00Z'
    },
    {
      id: 'txn_002',
      type: 'receive',
      amount: 500,
      currency: 'AFR',
      recipient: 'Your Wallet',
      description: 'Salary deposit',
      status: 'completed',
      createdAt: '2026-02-17T14:15:00Z',
      completedAt: '2026-02-17T14:16:30Z'
    },
    {
      id: 'txn_003',
      type: 'payment',
      amount: 75.50,
      currency: 'ETH',
      recipient: '0x742d...bc7f',
      description: 'International transfer',
      status: 'processing',
      createdAt: '2026-02-18T08:45:00Z'
    }
  ])

  const [selectedTransaction, setSelectedTransaction] = useState<ProcessingTransaction | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all')

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true
    return tx.status === filter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'fas fa-check-circle'
      case 'processing': return 'fas fa-spinner'
      case 'pending': return 'fas fa-hourglass-half'
      case 'failed': return 'fas fa-times-circle'
      default: return 'fas fa-question-circle'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const retryTransaction = (id: string) => {
    // Mark as pending again
    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { ...tx, status: 'pending' as const } : tx
    ))
    alert('Transaction queued for retry')
  }

  const downloadReceipt = (id: string) => {
    alert(`Downloading receipt for transaction ${id}...`)
  }

  return (
    <div className="page-wrap">
      <div className="txn-header">
        <div>
          <h1>Transaction Processing</h1>
          <p className="subtitle">Monitor, track, and manage all your transactions in real-time</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/transfer')}>
          <i className="fas fa-plus"></i>
          New Transaction
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <i className="fas fa-list"></i>
          All ({transactions.length})
        </button>
        <button
          className={`tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          <i className="fas fa-hourglass-half"></i>
          Pending ({transactions.filter(t => t.status === 'pending').length})
        </button>
        <button
          className={`tab ${filter === 'processing' ? 'active' : ''}`}
          onClick={() => setFilter('processing')}
        >
          <i className="fas fa-spinner"></i>
          Processing ({transactions.filter(t => t.status === 'processing').length})
        </button>
        <button
          className={`tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          <i className="fas fa-check-circle"></i>
          Completed ({transactions.filter(t => t.status === 'completed').length})
        </button>
        <button
          className={`tab ${filter === 'failed' ? 'active' : ''}`}
          onClick={() => setFilter('failed')}
        >
          <i className="fas fa-times-circle"></i>
          Failed ({transactions.filter(t => t.status === 'failed').length})
        </button>
      </div>

      <div className="txn-container">
        {/* Transactions List */}
        <div className="transactions-list">
          {filteredTransactions.length > 0 ? (
            <div className="card">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`transaction-item ${selectedTransaction?.id === tx.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <div className="txn-main">
                    <div className="txn-type-icon">
                      {tx.type === 'send' && <i className="fas fa-arrow-up"></i>}
                      {tx.type === 'receive' && <i className="fas fa-arrow-down"></i>}
                      {tx.type === 'payment' && <i className="fas fa-credit-card"></i>}
                    </div>

                    <div className="txn-info">
                      <h4>{tx.description}</h4>
                      <p className="txn-address">{tx.recipient}</p>
                      <p className="txn-time">{formatDate(tx.createdAt)}</p>
                    </div>

                    <div className="txn-amount">
                      <span className={`amount ${tx.type === 'send' ? 'negative' : 'positive'}`}>
                        {tx.type === 'send' ? '-' : '+'}
                        {tx.amount.toFixed(2)} {tx.currency}
                      </span>
                      <span className={`status-badge status-${tx.status}`}>
                        <i className={getStatusIcon(tx.status)}></i>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No transactions found</h3>
              <p>Start by creating a new transaction or payment</p>
              <button className="btn-primary" onClick={() => navigate('/transfer')}>
                <i className="fas fa-plus"></i>
                Create Transaction
              </button>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        {selectedTransaction && (
          <div className="transaction-details-panel card">
            <div className="details-header">
              <h3>Transaction Details</h3>
              <button
                className="btn-ghost"
                onClick={() => setSelectedTransaction(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="details-content">
              <div className="detail-section">
                <div className="detail-row">
                  <span className="label">Transaction ID</span>
                  <span className="value mono">{selectedTransaction.id}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Type</span>
                  <span className="value">
                    {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Status</span>
                  <span className={`value status-${selectedTransaction.status}`}>
                    <i className={getStatusIcon(selectedTransaction.status)}></i>
                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-row">
                  <span className="label">Amount</span>
                  <span className="value highlight">
                    {selectedTransaction.amount.toFixed(2)} {selectedTransaction.currency}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Recipient</span>
                  <span className="value">{selectedTransaction.recipient}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Description</span>
                  <span className="value">{selectedTransaction.description}</span>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-row">
                  <span className="label">Created</span>
                  <span className="value">{formatDate(selectedTransaction.createdAt)}</span>
                </div>
                {selectedTransaction.completedAt && (
                  <div className="detail-row">
                    <span className="label">Completed</span>
                    <span className="value">{formatDate(selectedTransaction.completedAt)}</span>
                  </div>
                )}
              </div>

              <div className="details-actions">
                {selectedTransaction.status === 'failed' && (
                  <button
                    className="btn-primary"
                    onClick={() => retryTransaction(selectedTransaction.id)}
                  >
                    <i className="fas fa-redo"></i>
                    Retry Transaction
                  </button>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => downloadReceipt(selectedTransaction.id)}
                >
                  <i className="fas fa-download"></i>
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="txn-stats">
        <h2>Statistics</h2>
        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{transactions.length}</div>
            <div className="stat-sub">All time</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Total Sent</div>
            <div className="stat-value">
              {transactions
                .filter(tx => tx.type === 'send')
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toFixed(2)}
            </div>
            <div className="stat-sub">AFR equivalent</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Total Received</div>
            <div className="stat-value">
              {transactions
                .filter(tx => tx.type === 'receive')
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toFixed(2)}
            </div>
            <div className="stat-sub">AFR equivalent</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Success Rate</div>
            <div className="stat-value">
              {(
                (transactions.filter(tx => tx.status === 'completed').length / transactions.length) * 100
              ).toFixed(0)}
              %
            </div>
            <div className="stat-sub">Completed transactions</div>
          </div>
        </div>
      </div>
    </div>
  )
}
