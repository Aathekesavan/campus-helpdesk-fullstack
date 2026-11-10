import React from 'react';

export default function TechniciansPage({ technicians, onFilterByTech }) {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">
          <h2>Campus Maintenance Technicians &amp; Staff Workload</h2>
          <p>Real-time active ticket distribution, staff availability, and department allocation</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {technicians.map(tech => (
          <div key={tech.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  👷 {tech.name}
                </h3>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {tech.department}
                </span>
              </div>
              <span style={{
                background: tech.available ? '#dcfce7' : '#fee2e2',
                color: tech.available ? '#16a34a' : '#dc2626',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {tech.available ? 'ON DUTY' : 'OFFLINE'}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              <div>✉️ <strong>Email:</strong> {tech.email}</div>
              <div>📞 <strong>Phone:</strong> {tech.phone}</div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Workload
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: tech.activeTickets > 3 ? '#ea580c' : 'var(--color-primary)' }}>
                  {tech.activeTickets} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>tickets</span>
                </div>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: tech.activeTickets > 3 ? '#ea580c' : '#16a34a'
              }}>
                {tech.activeTickets > 3 ? 'Heavy Queue' : 'Balanced Load'}
              </span>
            </div>

            <button
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
              onClick={() => onFilterByTech(tech.name)}
            >
              View Assigned Tickets &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
