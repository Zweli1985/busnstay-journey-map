import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './TransferPage.css'

export default function TransferPage() {
  const { user } = useAuth()
  const connected = !!user // User is connected if authenticated
  const [formData, setFormData] = useState({
    recipientAddress: '',
    amount: '',
    country: 'South Africa',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected) {
      alert('Please connect your wallet first')
      return
    }

    setLoading(true)
    try {
      // Simulate transfer
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          recipientAddress: '',
          amount: '',
          country: 'South Africa',
          description: ''
        })
      }, 3000)
    } catch (error) {
      alert('Transfer failed: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap">
      <div className="transfer-header">
        <h1>Cross-Border Transfer</h1>
        <p className="subtitle">Send Africoin instantly across BRICS nations with ultra-low fees</p>
      </div>

      <div className="transfer-container">
        <div className="transfer-form-section">
          <div className="card">
            <h2>Transfer Details</h2>
            
            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <span>Transfer initiated successfully! Check your wallet for confirmation.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="transfer-form">
              <div className="form-group">
                <label>Recipient Address</label>
                <input
                  type="text"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  placeholder="Enter Solana wallet address"
                  required
                />
                <small>Must be a valid Solana address</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (AFR)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <small>Available balance: 1,250.50 AFR</small>
                </div>

                <div className="form-group">
                  <label>Destination Country</label>
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option>South Africa</option>
                    <option>Brazil</option>
                    <option>India</option>
                    <option>Russia</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., Payment for goods, Salary transfer..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Send Transfer
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="transfer-info">
          <div className="card">
            <h2>Transfer Summary</h2>
            <div className="summary-item">
              <span className="summary-label">Amount:</span>
              <span className="summary-value">{formData.amount || '0'} AFR</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Network Fee:</span>
              <span className="summary-value positive">&lt; 0.001 AFR</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Cost:</span>
              <span className="summary-value">{formData.amount || '0'} AFR</span>
            </div>
            <div className="divider"></div>
            <div className="summary-item">
              <span className="summary-label">Destination:</span>
              <span className="summary-value">{formData.country}</span>
            </div>
          </div>

          <div className="card benefits">
            <h3>Why Africoin?</h3>
            <div className="benefit-list">
              <div className="benefit-item">
                <i className="fas fa-bolt"></i>
                <span>Instant settlement on Solana</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-percent"></i>
                <span>&lt; 0.1% transaction fees</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-lock"></i>
                <span>150% collateralized</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-globe"></i>
                <span>BRICS-focused</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-brain"></i>
                <span>AI fraud detection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
