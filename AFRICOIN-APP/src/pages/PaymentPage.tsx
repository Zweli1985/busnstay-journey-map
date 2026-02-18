import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './PaymentPage.css'

export default function PaymentPage() {
  const { user } = useAuth()
  const connected = !!user // User is connected if authenticated
  const [paymentType, setPaymentType] = useState<'card' | 'wallet' | 'qr'>('card')
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    amount: '',
    currency: 'USD'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCardData(prev => ({ ...prev, [name]: value }))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setCardData({
          cardNumber: '',
          cardName: '',
          expiryDate: '',
          cvv: '',
          amount: '',
          currency: 'USD'
        })
      }, 3000)
    } catch (error) {
      alert('Payment failed: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap">
      <div className="payment-header">
        <h1>Payment Processing</h1>
        <p className="subtitle">Securely process payments with Africoin and receive instant settlements</p>
      </div>

      <div className="payment-container">
        <div className="payment-form-section">
          <div className="payment-tabs">
            <button
              className={`tab-button ${paymentType === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentType('card')}
            >
              <i className="fas fa-credit-card"></i>
              Card Payment
            </button>
            <button
              className={`tab-button ${paymentType === 'wallet' ? 'active' : ''}`}
              onClick={() => setPaymentType('wallet')}
              disabled={!connected}
            >
              <i className="fas fa-wallet"></i>
              Wallet Payment
            </button>
            <button
              className={`tab-button ${paymentType === 'qr' ? 'active' : ''}`}
              onClick={() => setPaymentType('qr')}
            >
              <i className="fas fa-qrcode"></i>
              QR Payment
            </button>
          </div>

          <div className="card">
            {paymentType === 'card' && (
              <>
                <h2>Credit/Debit Card Payment</h2>
                
                {success && (
                  <div className="success-message">
                    <i className="fas fa-check-circle"></i>
                    <span>Payment processed successfully!</span>
                  </div>
                )}

                <form onSubmit={handlePayment} className="payment-form">
                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="•••"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={cardData.amount}
                        onChange={handleCardChange}
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Currency</label>
                      <select name="currency" value={cardData.currency} onChange={handleCardChange}>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>ZAR</option>
                        <option>BRL</option>
                        <option>INR</option>
                      </select>
                    </div>
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
                        <i className="fas fa-lock"></i>
                        Pay {cardData.amount || '0'} {cardData.currency}
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {paymentType === 'wallet' && connected && (
              <>
                <h2>Solana Wallet Payment</h2>
                <div className="wallet-payment">
                  <p>Connect your wallet and click below to authorize payment from your Africoin balance.</p>
                  <button className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                    <i className="fas fa-signature"></i>
                    Sign Transaction
                  </button>
                </div>
              </>
            )}

            {paymentType === 'qr' && (
              <>
                <h2>QR Code Payment</h2>
                <div className="qr-payment">
                  <div className="qr-code-placeholder">
                    <i className="fas fa-qrcode"></i>
                    <p>QR Code generated for merchant</p>
                  </div>
                  <p className="qr-instructions">
                    Scan this QR code with your Africoin mobile app to complete the payment securely.
                  </p>
                  <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                    <i className="fas fa-download"></i>
                    Download QR Code
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="payment-info">
          <div className="card security-card">
            <h3>Security & Trust</h3>
            <div className="security-list">
              <div className="security-item">
                <i className="fas fa-lock"></i>
                <span>PCI DSS Compliant</span>
              </div>
              <div className="security-item">
                <i className="fas fa-shield-alt"></i>
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="security-item">
                <i className="fas fa-check-double"></i>
                <span>3D Secure Authentication</span>
              </div>
              <div className="security-item">
                <i className="fas fa-brain"></i>
                <span>AI Fraud Detection</span>
              </div>
              <div className="security-item">
                <i className="fas fa-file-shield"></i>
                <span>AML Compliance</span>
              </div>
            </div>
          </div>

          <div className="card features-card">
            <h3>Payment Features</h3>
            <ul className="features-list">
              <li>
                <span className="feature-title">Instant Settlement</span>
                <span className="feature-desc">Funds instantly available in your Africoin wallet</span>
              </li>
              <li>
                <span className="feature-title">Multiple Currencies</span>
                <span className="feature-desc">Accept payments in any currency</span>
              </li>
              <li>
                <span className="feature-title">Recurring Payments</span>
                <span className="feature-desc">Set up subscriptions and recurring bills</span>
              </li>
              <li>
                <span className="feature-title">Low Fees</span>
                <span className="feature-desc">Only 0.8% for card payments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
