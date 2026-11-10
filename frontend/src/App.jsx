import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CreateTicketModal from './components/CreateTicketModal';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import TechniciansPage from './pages/TechniciansPage';
import MicroserviceAuditPage from './pages/MicroserviceAuditPage';
import { HelpdeskAPI } from './services/api';

import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    categoryId: 'ALL'
  });

  useEffect(() => {
    initApp();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const initApp = async () => {
    const online = await HelpdeskAPI.checkHealth();
    setIsOnline(online);

    const [cats, techs, tix, s] = await Promise.all([
      HelpdeskAPI.getCategories(),
      HelpdeskAPI.getTechnicians(),
      HelpdeskAPI.getTickets(filters),
      HelpdeskAPI.getDashboardStats()
    ]);

    setCategories(cats || []);
    setTechnicians(techs || []);
    setTickets(tix || []);
    setStats(s || {});
  };

  const handleFilterChange = async (key, val) => {
    const updated = { ...filters, [key]: val };
    setFilters(updated);
    const tix = await HelpdeskAPI.getTickets(updated);
    setTickets(tix || []);
  };

  const handleSelectTicket = (id) => {
    setSelectedTicketId(id);
    setActivePage('detail');
  };

  const handleCreateTicket = async (ticketData) => {
    const created = await HelpdeskAPI.createTicket(ticketData);
    showToast(`Ticket ${created.ticketNumber} successfully submitted!`);
    await initApp();
    handleSelectTicket(created.id);
  };

  const handleUpdateStatus = async (id, status, performedBy, resolutionNotes) => {
    const updated = await HelpdeskAPI.updateStatus(id, status, performedBy, resolutionNotes);
    showToast(`Status updated to ${status}`);
    await initApp();
    return updated;
  };

  const handleAssignTechnician = async (ticketId, techId, assignedBy) => {
    const updated = await HelpdeskAPI.assignTechnician(ticketId, techId, assignedBy);
    showToast(`Assigned to staff technician!`);
    await initApp();
    return updated;
  };

  const handleAddComment = async (ticketId, authorName, authorRole, message, isInternal) => {
    const comment = await HelpdeskAPI.addComment(ticketId, authorName, authorRole, message, isInternal);
    showToast(`Comment added to ticket thread.`);
    return comment;
  };

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        setActivePage={(p) => {
          setActivePage(p);
          if (p !== 'detail') setSelectedTicketId(null);
        }}
        isOnline={isOnline}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <main className="main-content">
        {activePage === 'dashboard' && (
          <DashboardPage
            stats={stats}
            recentTickets={tickets}
            onSelectTicket={handleSelectTicket}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activePage === 'tickets' && (
          <TicketsPage
            tickets={tickets}
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSelectTicket={handleSelectTicket}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activePage === 'detail' && selectedTicketId && (
          <TicketDetailPage
            ticketId={selectedTicketId}
            onBack={() => setActivePage('tickets')}
            technicians={technicians}
            onUpdateStatus={handleUpdateStatus}
            onAssignTechnician={handleAssignTechnician}
            onAddComment={handleAddComment}
            fetchComments={(id) => HelpdeskAPI.getComments(id)}
            fetchTicket={(id) => HelpdeskAPI.getTicketById(id)}
          />
        )}

        {activePage === 'technicians' && (
          <TechniciansPage
            technicians={technicians}
            onFilterByTech={(techName) => {
              handleFilterChange('search', techName);
              setActivePage('tickets');
            }}
          />
        )}

        {activePage === 'microservice' && (
          <MicroserviceAuditPage />
        )}
      </main>

      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem 1.5rem',
        marginTop: 'auto',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        <div>
          <strong>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</strong> &bull; Tiruchirappalli Campus &bull; Department of CSE
        </div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600 }}>
          Team Members: Aathekesavan R (RA2411003050015) &bull; Lino Joshwa (RA2411003050051) &bull; Praveen K (RA2411003050056)
        </div>
        <div style={{ marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          21CSE354T Full Stack Web Development &bull; Task 4 Team Project &bull; Faculty: Dr. P. Hariharan, AP, CSE
        </div>
      </footer>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        categories={categories}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleCreateTicket}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
