import React, { useState, useEffect } from 'react';
import StatusStepper from '../components/StatusStepper';

export default function TicketDetailPage({
  ticketId,
  onBack,
  technicians,
  onUpdateStatus,
  onAssignTechnician,
  onAddComment,
  fetchComments,
  fetchTicket
}) {
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('Staff Engineer');
  const [isInternal, setIsInternal] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [ticketId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const t = await fetchTicket(ticketId);
      setTicket(t);
      const c = await fetchComments(ticketId);
      setComments(c || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading ticket telemetry and lifecycle state...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h3>Ticket not found</h3>
        <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={onBack}>
          Back to Directory
        </button>
      </div>
    );
  }

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = await onAddComment(ticket.id, authorName, 'STAFF', commentText, isInternal);
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      alert('Failed to post comment: ' + err.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'RESOLVED') {
      setShowResolveModal(true);
      return;
    }

    try {
      const updated = await onUpdateStatus(ticket.id, newStatus, 'Helpdesk Admin', null);
      setTicket(updated);
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const submitResolution = async () => {
    if (!resolutionText.trim()) {
      alert('Please specify resolution notes explaining how the issue was fixed.');
      return;
    }
    try {
      const updated = await onUpdateStatus(ticket.id, 'RESOLVED', 'Murugan S (Technician)', resolutionText);
      setTicket(updated);
      setShowResolveModal(false);
      setResolutionText('');
    } catch (err) {
      alert('Resolution submission failed: ' + err.message);
    }
  };

  const handleTechnicianChange = async (techId) => {
    if (!techId) return;
    try {
      const updated = await onAssignTechnician(ticket.id, Number(techId), 'Admin Desk');
      setTicket(updated);
    } catch (err) {
      alert('Technician assignment failed: ' + err.message);
    }
  };

  // SLA Calculation
  const slaDate = new Date(ticket.slaDueTime);
  const now = new Date();
  const diffHours = Math.round((slaDate - now) / 3600000);
  const isOverdue = diffHours < 0 && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED';

  return (
    <div className="fade-in">
      {/* Back button & Breadcrumb */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          &larr; Back to Directory
        </button>
      </div>

      {/* Ticket Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="ticket-num-badge" style={{ fontSize: '1rem', padding: '0.3rem 0.75rem' }}>
                {ticket.ticketNumber}
              </span>
              <span className={`badge badge-${ticket.priority.toLowerCase()}`}>
                {ticket.priority} PRIORITY
              </span>
              <span className={`badge badge-${ticket.status.toLowerCase()}`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {ticket.title}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Logged on {new Date(ticket.createdAt).toLocaleString()} &bull; Category: {ticket.category?.name}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              SLA Due Target
            </div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: isOverdue ? 'var(--color-critical)' : 'var(--color-primary)',
              marginTop: '2px'
            }}>
              {slaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({slaDate.toLocaleDateString()})
            </div>
            <div style={{ fontSize: '0.75rem', color: isOverdue ? 'var(--color-critical)' : 'var(--color-low)', fontWeight: 700 }}>
              {ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? (
                '✓ Met Service Target'
              ) : isOverdue ? (
                `⚠️ SLA Breached by ${Math.abs(diffHours)} hour(s)`
              ) : (
                `⏱️ ${diffHours} hour(s) remaining`
              )}
            </div>
          </div>
        </div>

        {/* Status Lifecycle Stepper */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <StatusStepper currentStatus={ticket.status} />
        </div>
      </div>

      {/* Main Grid: Details & Side Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Description, Location, Requester, Comments */}
        <div>
          {/* Issue Description Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3>Problem Description</h3>
            </div>
            <div className="card-body">
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {ticket.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Campus Location
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '3px' }}>
                    📍 {ticket.location}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Requester Details
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '3px' }}>
                    👤 {ticket.requesterName} ({ticket.requesterRole})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ✉️ {ticket.requesterEmail} {ticket.requesterPhone && `• 📞 ${ticket.requesterPhone}`}
                  </div>
                </div>
              </div>

              {ticket.resolutionNotes && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    ✅ Resolution Summary (Verified on {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleString() : 'N/A'})
                  </div>
                  <div style={{ color: '#15803d', fontSize: '0.9rem' }}>
                    {ticket.resolutionNotes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Discussion & Resolution Notes Feed */}
          <div className="card">
            <div className="card-header">
              <h3>Discussion &amp; Service Notes ({comments.length})</h3>
            </div>
            <div className="card-body">
              {comments.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  No updates or technician notes logged yet for this request.
                </p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className={`comment-item ${c.isInternal ? 'comment-internal' : ''}`}>
                    <div className="comment-header">
                      <div>
                        <span className="comment-author">{c.authorName}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                          [{c.authorRole}]
                        </span>
                        {c.isInternal && (
                          <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: '#fef08a', color: '#854d0e', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            INTERNAL NOTE
                          </span>
                        )}
                      </div>
                      <span className="comment-date">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="comment-body">{c.message}</div>
                  </div>
                ))
              )}

              {/* Add Comment Form */}
              <form onSubmit={handlePostComment} style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                  Add Note or Update Requester
                </div>
                <div className="form-group">
                  <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="Enter notes, diagnostic findings, or progress message..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={e => setIsInternal(e.target.checked)}
                    />
                    <span>Staff internal diagnostic note (hide from requester)</span>
                  </label>

                  <button type="submit" className="btn btn-primary btn-sm">
                    Post Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Technician Assignment */}
        <div>
          {/* Action / Lifecycle Management Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3>Lifecycle Actions</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ticket.status === 'OPEN' && (
                <button className="btn btn-primary" onClick={() => handleStatusChange('ASSIGNED')}>
                  📌 Assign to Staff
                </button>
              )}

              {(ticket.status === 'OPEN' || ticket.status === 'ASSIGNED') && (
                <button className="btn btn-accent" onClick={() => handleStatusChange('IN_PROGRESS')}>
                  ⚡ Start Work (In Progress)
                </button>
              )}

              {ticket.status === 'IN_PROGRESS' && (
                <button className="btn" style={{ background: '#16a34a', color: '#ffffff' }} onClick={() => handleStatusChange('RESOLVED')}>
                  ✅ Mark Issue as Resolved
                </button>
              )}

              {ticket.status === 'RESOLVED' && (
                <button className="btn btn-outline" onClick={() => handleStatusChange('CLOSED')}>
                  🔒 Close Ticket
                </button>
              )}

              {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
                <button className="btn btn-outline btn-sm" onClick={() => handleStatusChange('IN_PROGRESS')}>
                  🔄 Re-open Issue
                </button>
              )}
            </div>
          </div>

          {/* Assigned Technician Card */}
          <div className="card">
            <div className="card-header">
              <h3>Assigned Staff Technician</h3>
            </div>
            <div className="card-body">
              {ticket.technician ? (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary)' }}>
                    👷 {ticket.technician.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {ticket.technician.department}
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    📞 {ticket.technician.phone}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                  No technician currently assigned.
                </div>
              )}

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Reassign Technician:</label>
                <select
                  className="form-select"
                  value={ticket.technician?.id || ''}
                  onChange={e => handleTechnicianChange(e.target.value)}
                >
                  <option value="">Select Technician...</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} — {tech.department} ({tech.activeTickets} active)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolveModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Verify &amp; Close Maintenance Request</h3>
              <button className="modal-close" onClick={() => setShowResolveModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Please document the repair action performed, parts replaced, or corrective steps taken:
              </p>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="e.g., Replaced 16A circuit breaker switchboard terminal. Tested voltage with multimeter."
                value={resolutionText}
                onChange={e => setResolutionText(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowResolveModal(false)}>
                Cancel
              </button>
              <button className="btn" style={{ background: '#16a34a', color: '#ffffff' }} onClick={submitResolution}>
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
