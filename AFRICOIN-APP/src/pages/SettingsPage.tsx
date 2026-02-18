import { useState } from 'react'
import './SettingsPage.css'

export default function SettingsPage() {
  const [walletAddress] = useState('3xML...B7Ym') // Mock wallet address
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    twoFactor: false,
    theme: 'dark',
    currency: 'USD'
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="page-wrap">
      <div className="settings-header">
        <h1>Settings & Preferences</h1>
        <p className="subtitle">Manage your Africoin account and security settings</p>
      </div>

      <div className="settings-container">
        {/* Account Section */}
        <div className="settings-section">
          <div className="section-title">
            <i className="fas fa-user-circle"></i>
            Account
          </div>

          <div className="card">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Wallet Address</h4>
                <p className="mono">{walletAddress}</p>
              </div>
              <button
                className="btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress)
                  alert('Address copied to clipboard!')
                }}
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>

            <div className="divider"></div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Account Type</h4>
                <p>Individual - Standard Tier</p>
              </div>
              <button className="btn-secondary">Upgrade</button>
            </div>

            <div className="divider"></div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Join Date</h4>
                <p>February 18, 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="settings-section">
          <div className="section-title">
            <i className="fas fa-shield-alt"></i>
            Security
          </div>

          <div className="card">
            <div className="setting-toggle">
              <div className="setting-info">
                <h4>Two-Factor Authentication (2FA)</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="divider"></div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Change Password</h4>
                <p>Update your account password regularly</p>
              </div>
              <button className="btn-secondary">Change</button>
            </div>

            <div className="divider"></div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Active Sessions</h4>
                <p>1 active session on this device</p>
              </div>
              <button className="btn-secondary">Manage</button>
            </div>

            <div className="divider"></div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Login Activity</h4>
                <p>View recent login attempts and locations</p>
              </div>
              <button className="btn-secondary">View</button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section">
          <div className="section-title">
            <i className="fas fa-bell"></i>
            Notifications
          </div>

          <div className="card">
            <div className="setting-toggle">
              <div className="setting-info">
                <h4>Push Notifications</h4>
                <p>Receive real-time updates on transactions</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="divider"></div>

            <div className="setting-toggle">
              <div className="setting-info">
                <h4>Email Alerts</h4>
                <p>Get email notifications for important activities</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={() => handleToggle('emailAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="settings-section">
          <div className="section-title">
            <i className="fas fa-sliders-h"></i>
            Preferences
          </div>

          <div className="card">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Display Currency</h4>
                <p>Choose your preferred currency for display</p>
              </div>
              <select
                value={settings.currency}
                onChange={(e) => handleSelectChange('currency', e.target.value)}
                className="settings-select"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>ZAR</option>
                <option>BRL</option>
                <option>INR</option>
              </select>
            </div>

            <div className="divider"></div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Theme</h4>
                <p>Choose your preferred interface theme</p>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => handleSelectChange('theme', e.target.value)}
                className="settings-select"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="divider"></div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Language</h4>
                <p>Select your preferred language</p>
              </div>
              <select className="settings-select">
                <option>English</option>
                <option>French</option>
                <option>Portuguese</option>
                <option>Spanish</option>
                <option>Swahili</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="section-title danger">
            <i className="fas fa-exclamation-triangle"></i>
            Danger Zone
          </div>

          <div className="card">
            <div className="danger-item">
              <div>
                <h4>Disconnect Wallet</h4>
                <p>Remove this wallet from your account</p>
              </div>
              <button className="btn-danger">Disconnect</button>
            </div>

            <div className="divider"></div>

            <div className="danger-item">
              <div>
                <h4>Delete Account</h4>
                <p>Permanently delete your Africoin account and all data</p>
              </div>
              <button className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
