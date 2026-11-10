import React from 'react';

export default function Navbar({ activePage, setActivePage, isOnline, onOpenCreateModal }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => setActivePage('dashboard')}>
          <div className="nav-logo-icon">SRM</div>
          <div className="nav-brand-text">
            <h1>Campus Helpdesk</h1>
            <span>SRM IST • Maintenance &amp; IT Service Portal</span>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-link ${activePage === 'tickets' ? 'active' : ''}`}
            onClick={() => setActivePage('tickets')}
          >
            🎫 Tickets Explorer
          </button>
          <button
            className={`nav-link ${activePage === 'technicians' ? 'active' : ''}`}
            onClick={() => setActivePage('technicians')}
          >
            👷 Staff Technicians
          </button>
          <button
            className={`nav-link ${activePage === 'microservice' ? 'active' : ''}`}
            onClick={() => setActivePage('microservice')}
          >
            ⚡ Notification Microservice
          </button>
        </nav>

        <div className="nav-actions">
          <div className="status-indicator" title={isOnline ? 'Connected to Spring Boot API' : 'Using Local Resilient Mock Storage'}>
            <span className={`status-dot ${isOnline ? 'online' : 'mock'}`}></span>
            <span>{isOnline ? 'API Connected' : 'Standalone Mode'}</span>
          </div>
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            ➕ Report Issue
          </button>
        </div>
      </div>
    </header>
  );
}
