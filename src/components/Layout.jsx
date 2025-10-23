import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Usuários', icon: '👥' },
    { path: '/donations', label: 'Doações', icon: '💰' },
    { path: '/events', label: 'Eventos', icon: '📅' },
    { path: '/volunteers', label: 'Voluntários', icon: '🤝' }
  ]

  return (
    <div className="layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay open" onClick={closeSidebar}></div>
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">+1</div>
            <div className="logo-text">Mais de Nós</div>
          </div>
          <div className="logo-subtitle">CRM Administrativo</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Principal</div>
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              A
            </div>
            <div className="user-details">
              <h4>Administrador</h4>
              <p>admin@maisdenos.online</p>
            </div>
          </div>
          <button className="logout-btn">
            Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="header-title">Painel Administrativo</h1>
          <div className="header-actions">
            <button className="notification-btn">
              🔔
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout