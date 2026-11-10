import React from 'react';
import StatCard from '../components/StatCard';

export default function DashboardPage({ stats, recentTickets, onSelectTicket, onOpenCreateModal }) {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">
          <h2>Campus Operations &amp; Maintenance Dashboard</h2>
          <p>Real-time telemetry, category distribution, and SLA resolution compliance</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            ➕ Submit Maintenance Request
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        <StatCard
          title="Total Requests"
          value={stats.totalTickets || 0}
          meta="All logged campus issues"
          icon="📋"
          iconBg="#e0f2fe"
          iconColor="#0284c7"
        />
        <StatCard
          title="Pending / Open"
          value={(stats.openTickets || 0) + (stats.assignedTickets || 0)}
          meta={`${stats.openTickets || 0} unassigned • ${stats.assignedTickets || 0} assigned`}
          icon="⏳"
          iconBg="#fef3c7"
          iconColor="#d97706"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressTickets || 0}
          meta="Actively being serviced"
          icon="🔧"
          iconBg="#e0e7ff"
          iconColor="#4f46e5"
        />
        <StatCard
          title="Resolved &amp; Closed"
          value={(stats.resolvedTickets || 0) + (stats.closedTickets || 0)}
          meta={`${stats.resolutionRatePercentage || 0}% resolution efficiency`}
          icon="✅"
          iconBg="#dcfce7"
          iconColor="#16a34a"
        />
        <StatCard
          title="Critical / High"
          value={stats.criticalTickets || 0}
          meta="Escalated to NOC / Staff"
          icon="🚨"
          iconBg="#fee2e2"
          iconColor="#dc2626"
        />
      </div>

      {/* SLA Alert Banner if any critical ticket is pending */}
      {stats.criticalTickets > 0 && (
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <div>
              <strong style={{ color: '#9f1239', fontSize: '0.95rem' }}>Urgent Attention Required</strong>
              <p style={{ color: '#be123c', fontSize: '0.85rem', margin: 0 }}>
                {stats.criticalTickets} critical ticket(s) are currently flagged with expedited SLA response targets.
              </p>
            </div>
          </div>
          <span className="badge badge-critical">Expedited SLA</span>
        </div>
      )}

      {/* Main Content Split: Category Distribution & Recent Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Category Breakdown Card */}
        <div className="card">
          <div className="card-header">
            <h3>Department Categories</h3>
          </div>
          <div className="card-body">
            {stats.ticketsByCategory && Object.entries(stats.ticketsByCategory).map(([cat, count]) => {
              const pct = stats.totalTickets > 0 ? Math.round((count / stats.totalTickets) * 100) : 0;
              return (
                <div key={cat} style={{ marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <span>{cat}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tickets Table Card */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Maintenance Requests</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Latest campus submissions</span>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Summary</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Tech</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.slice(0, 5).map(t => (
                  <tr key={t.id}>
                    <td>
                      <span className="ticket-num-badge">{t.ticketNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {t.location}</div>
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
                    <td style={{ fontSize: '0.85rem' }}>
                      {t.technician ? t.technician.name : <span style={{ color: '#94a3b8' }}>Unassigned</span>}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onSelectTicket(t.id)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
