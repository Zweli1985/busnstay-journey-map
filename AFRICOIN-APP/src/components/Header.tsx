import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const [navOpen, setNavOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const closeNav = () => {
    setNavOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="nav">
        <div className="nav-left">
          <div className="nav-logo">
            <i className="fas fa-coins"></i>
          </div>
          <div className="nav-title">
            <span>AFRICOIN</span>
            <span>Resource-Backed Stablecoin</span>
          </div>
        </div>

        <button 
          className="nav-toggle" 
          aria-label="Toggle navigation"
          onClick={toggleNav}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${navOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeNav}>Home</Link>
          <Link to="/dashboard" onClick={closeNav}>Dashboard</Link>
          <Link to="/transfer" onClick={closeNav}>Transfer</Link>
          <Link to="/transactions" onClick={closeNav}>Transactions</Link>
          <Link to="/payment" onClick={closeNav}>Payment</Link>
          <Link to="/settings" onClick={closeNav}>Settings</Link>
        </nav>

        <div className="nav-cta">
          <div className="nav-pill">
            <i className="fas fa-map-marker-alt"></i>
            Johannesburg • BRICS Focus
          </div>
          
          <div className="user-menu">
            <button 
              className="user-menu-toggle"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title={user?.email}
            >
              <div className="user-avatar-small">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user?.firstName}</span>
              <i className={`fas fa-chevron-down ${userMenuOpen ? 'open' : ''}`}></i>
            </button>

            {userMenuOpen && (
              <div className="user-menu-dropdown">
                <Link to="/profile" className="menu-item" onClick={() => setUserMenuOpen(false)}>
                  <i className="fas fa-user"></i>
                  My Profile
                </Link>
                <Link to="/dashboard" className="menu-item" onClick={() => setUserMenuOpen(false)}>
                  <i className="fas fa-tachometer-alt"></i>
                  Dashboard
                </Link>
                <Link to="/settings" className="menu-item" onClick={() => setUserMenuOpen(false)}>
                  <i className="fas fa-cog"></i>
                  Settings
                </Link>
                <div className="menu-divider"></div>
                <button className="menu-item logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
