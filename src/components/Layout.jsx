import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'dashboard' },
    { name: 'Usuários', href: '/users', icon: 'people' },
    { name: 'Doações', href: '/donations', icon: 'volunteer_activism' },
    { name: 'Eventos', href: '/events', icon: 'event' },
    { name: 'Voluntários', href: '/volunteers', icon: 'group' },
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h1>+1</h1>
            <p>Mais de Nós</p>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="material-icons-round">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <span className="material-icons-round">person</span>
            </div>
            <div className="user-details">
              <p className="user-name">{user?.email}</p>
              <p className="user-role">Administrador</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <span className="material-icons-round">logout</span>
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <button 
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-icons-round">menu</span>
          </button>
          
          <div className="header-title">
            <h1>CRM - Mais de Nós</h1>
            <p>Painel de Controle Administrativo</p>
          </div>

          <div className="header-actions">
            <div className="user-menu">
              <div className="user-avatar-small">
                <span className="material-icons-round">person</span>
              </div>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
