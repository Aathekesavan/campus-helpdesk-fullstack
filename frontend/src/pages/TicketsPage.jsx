import React from 'react';

export default function TicketsPage({
  tickets,
  categories,
  filters,
  onFilterChange,
  onSelectTicket,
  onOpenCreateModal
}) {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">
          <h2>Maintenance Tickets Directory</h2>
          <p>Search, filter, track status, and inspect issues across all campus facilities</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            ➕ Report New Issue
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        <button
          className={`category-pill ${filters.categoryId === 'ALL' ? 'active' : ''}`}
          onClick={() => onFilterChange('categoryId', 'ALL')}
        >
          🌐 All Categories ({tickets.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-pill ${filters.categoryId === String(cat.id) ? 'active' : ''}`}
            onClick={() => onFilterChange('categoryId', String(cat.id))}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tickets by tracking code, title, room, requester..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            className="filter-select"
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Tickets Table Card */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Issue Summary</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Requester</th>
                <th>Technician</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No tickets found matching the specified filters. Try adjusting your search or clearing criteria.
                  </td>
                </tr>
              ) : (
                tickets.map(t => (
                  <tr key={t.id}>
                    <td>
                      <span className="ticket-num-badge">{t.ticketNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-primary)' }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        📍 {t.location}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {t.category?.name || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${t.status.toLowerCase()}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.requesterName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.requesterRole}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {t.technician ? (
                        <div>
                          <div style={{ fontWeight: 600 }}>{t.technician.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.technician.phone}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelectTicket(t.id)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0.9rem 1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Showing {tickets.length} maintenance record(s)</span>
          <span>Relational Schema &bull; H2/MySQL Persistent</span>
        </div>
      </div>
    </div>
  );
}
