import { Link } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {

  return (
    <div className="page-wrap">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-left-badge">
            <div className="hero-left-badge-icon">
              <i className="fas fa-bolt"></i>
            </div>
            Solana-native, resource-backed digital currency
          </div>

          <h1 className="hero-title">
            AFRICOIN<br />
            <span>for Global Trade & BRICS</span>
          </h1>

          <p className="hero-subtitle">
            A resource-backed stablecoin on Solana, over-collateralized by tokenized gold and oil, designed as a soft USD alternative for high-speed, ultra-low-fee cross-border settlement.
          </p>

          <p className="hero-meta">
            Available on <span>Solana Mainnet-Beta</span><br />
            Headquarters: <span>Johannesburg, Gauteng, South Africa</span>
          </p>

          <div className="hero-cta-row">
            <button className="btn-primary" onClick={() => alert('Wallet integration coming soon!')}>
              <i className="fas fa-wallet"></i>
              Connect Wallet
            </button>
            <Link to="/dashboard" className="btn-ghost">
              <i className="fas fa-tachometer-alt"></i>
              Dashboard
            </Link>
            <Link to="/payment" className="btn-ghost">
              <i className="fas fa-credit-card"></i>
              Make Payment
            </Link>
          </div>

          <div className="hero-pills-row">
            <div className="hero-pill">
              <i className="fas fa-shield-alt"></i>
              150% over-collateralized by tokenized resources
            </div>
            <div className="hero-pill">
              <i className="fas fa-globe-africa"></i>
              BRICS-focused cross-border settlement
            </div>
            <div className="hero-pill">
              <i className="fas fa-microchip"></i>
              AI-enhanced risk & fraud analytics
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="card">
            <div className="hero-card-header">
              <div className="hero-token-pill">
                <i className="fas fa-coins"></i>
                AFR • Stable, resource-backed
              </div>
              <span>
                Live on Solana
                <i className="fas fa-signal"></i>
              </span>
            </div>

            <div className="hero-grid">
              <div className="metric-card">
                <div className="metric-label">Peg & Stability</div>
                <div className="metric-value">~1.00 USD</div>
                <div className="metric-sub">Soft peg via over-collateralization</div>
                <div className="metric-positive">
                  <i className="fas fa-dot-circle"></i>
                  150% collateral ratio target
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Network & Fees</div>
                <div className="metric-value">&lt; 0.1%</div>
                <div className="metric-sub">Ultra-low settlement cost</div>
                <div className="metric-positive">
                  <i className="fas fa-tachometer-alt"></i>
                  65,000 TPS capacity
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Supply</div>
                <div className="metric-value">1,000,000,000</div>
                <div className="metric-sub">AFR fixed maximum supply</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Governance</div>
                <div className="metric-value">DAO</div>
                <div className="metric-sub">On-chain voting</div>
              </div>
            </div>

            <div className="hero-mint-box">
              <span>
                <strong>Mint Address:</strong><br/>
                2LKSzXEohSueuv2e447og7QriBDkVWbcXxgAogVusY8i
              </span>
              <button 
                className="hero-mint-copy"
                onClick={() => {
                  navigator.clipboard.writeText('2LKSzXEohSueuv2e447og7QriBDkVWbcXxgAogVusY8i')
                  alert('Copied to clipboard!')
                }}
              >
                <i className="far fa-copy"></i>
                Copy
              </button>
            </div>

            <div className="hero-tag-row">
              <div className="hero-tag">
                <i className="fas fa-wallet"></i>
                Phantom Wallet support
              </div>
              <div className="hero-tag">
                <i className="fas fa-qrcode"></i>
                QR payments available
              </div>
              <div className="hero-tag">
                <i className="fas fa-database"></i>
                Tokenized collateral
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="section-header">
          <div>
            <div className="section-kicker">Core Services</div>
            <h2 className="section-title">
              Africoin <span>in action</span>
            </h2>
            <p className="section-subtitle">
              Discover how Africoin powers cross-border payments and settlements.
            </p>
          </div>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-globe-americas"></i>
            </div>
            <h3>Cross-border BRICS Settlements</h3>
            <p>Instant low-fee Africoin settlements for merchants trading across South Africa, India and Brazil.</p>
            <Link to="/transfer" className="service-link">Explore →</Link>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-qrcode"></i>
            </div>
            <h3>Merchant QR & Card Payments</h3>
            <p>Retail stores accept Africoin via QR codes and virtual cards with instant settlements.</p>
            <Link to="/payment" className="service-link">Get Started →</Link>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-brain"></i>
            </div>
            <h3>AI-Driven Risk Analytics</h3>
            <p>Real-time monitoring for fraud detection, AML compliance and institutional-grade controls.</p>
            <Link to="/dashboard" className="service-link">View Analytics →</Link>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-gem"></i>
            </div>
            <h3>Tokenized Resource Backing</h3>
            <p>Transparent on-chain collateral with tokenized gold and oil reserves for price stability.</p>
            <a href="#" className="service-link">Learn More →</a>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="feature-title">Why Choose Africoin?</h2>
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-check"><i className="fas fa-check"></i></div>
            <div>
              <strong>Over-Collateralized</strong>
              <p>150% collateralization by BRICS-sourced gold and oil</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-check"><i className="fas fa-check"></i></div>
            <div>
              <strong>Ultra-Fast</strong>
              <p>Solana's 65,000 TPS capacity for near-instant settlements</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-check"><i className="fas fa-check"></i></div>
            <div>
              <strong>Extremely Low Fees</strong>
              <p>Less than 0.1% transaction costs vs. traditional SWIFT</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-check"><i className="fas fa-check"></i></div>
            <div>
              <strong>Governance</strong>
              <p>Decentralized DAO voting on monetary policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
