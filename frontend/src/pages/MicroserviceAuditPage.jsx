import React, { useState, useEffect } from 'react';
import { HelpdeskAPI } from '../services/api';

export default function MicroserviceAuditPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    setLoading(true);
    try {
      const logs = await HelpdeskAPI.getMicroserviceAuditLog();
      setAuditLogs(logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">
          <h2>Microservice Telemetry &amp; Notification Audit Log</h2>
          <p>Evidence for Unit V / CO-5: Standalone Notification &amp; SLA Compliance Microservice (Port 8085)</p>
        </div>
        <div>
          <button className="btn btn-outline btn-sm" onClick={loadAudit}>
            🔄 Refresh Audit Stream
          </button>
        </div>
      </div>

      {/* Architecture Visual Callout */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #1b365d, #0f223c)', color: '#ffffff' }}>
        <h3 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.75rem' }}>
          Autonomous Microservices Communication Flow
        </h3>
        <p style={{ color: '#93c5fd', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '850px', lineHeight: 1.6 }}>
          When maintenance tickets are created, assigned, or escalated, the Core Backend dispatches non-blocking REST events to the 
          <strong> Notification &amp; SLA Alert Microservice (Port 8085)</strong>. The microservice autonomously determines delivery 
          channels (Campus SMS Gateway, SMTP Email, or NOC Pager) without coupling to the primary database.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>💻 React Client</div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Port 5173 &bull; Presentation</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#38bdf8' }}>
            &rarr;
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>⚙️ Helpdesk Backend</div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Port 8080 &bull; Business Logic</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#38bdf8' }}>
            &rarr;
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>⚡ Notification Service</div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Port 8085 &bull; Autonomous CO-5</div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card">
        <div className="card-header">
          <h3>Ingested Event Log ({auditLogs.length} Records)</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Captured by Notification Service (Port 8085)</span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Event Type</th>
                <th>Ticket Ref</th>
                <th>Recipient</th>
                <th>Delivery Channel</th>
                <th>Status</th>
                <th>Dispatched At</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No microservice events logged yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.recordId}>
                    <td>
                      <span className="ticket-num-badge" style={{ background: '#f1f5f9', color: '#334155' }}>
                        {log.recordId}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                        {log.eventType}
                      </span>
                    </td>
                    <td>
                      <span className="ticket-num-badge">{log.ticketNumber}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{log.recipient}</td>
                    <td>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        background: log.channel.includes('SMS') ? '#fee2e2' : '#e0f2fe',
                        color: log.channel.includes('SMS') ? '#dc2626' : '#0369a1'
                      }}>
                        {log.channel}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
                        ✓ {log.deliveryStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(log.dispatchedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
