import React, { useState } from 'react';

export default function CreateTicketModal({ categories, isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: categories[0]?.id || 1,
    priority: 'MEDIUM',
    location: '',
    requesterName: '',
    requesterEmail: '',
    requesterRole: 'STUDENT',
    requesterPhone: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters';
    }

    if (!formData.location.trim()) {
      errs.location = 'Location (e.g. Lab 304, Tech Park Block 3) is required';
    }

    if (!formData.requesterName.trim()) {
      errs.requesterName = 'Requester name is required';
    }

    if (!formData.requesterEmail.trim()) {
      errs.requesterEmail = 'Institutional email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.requesterEmail.trim())) {
      errs.requesterEmail = 'Please enter a valid email address';
    }

    if (!formData.description.trim()) {
      errs.description = 'Please provide details of the maintenance issue';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmitSuccess(formData);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Submission failed. Please check inputs.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Report Maintenance / IT Issue</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.form && (
              <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {errors.form}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Issue Summary / Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Short circuit in CSE Lab 3, Projector flicker in Seminar Hall"
                className="form-input"
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name} ({cat.slaHours}h SLA)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority Level *</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="LOW">Low (Routine maintenance)</option>
                  <option value="MEDIUM">Medium (Normal priority)</option>
                  <option value="HIGH">High (Disrupting work)</option>
                  <option value="CRITICAL">Critical (Immediate hazard / Outage)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Campus Location &amp; Room Details *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Tech Park Block 3, 2nd Floor, Room 304"
                className="form-input"
              />
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Requester Full Name *</label>
                <input
                  type="text"
                  name="requesterName"
                  value={formData.requesterName}
                  onChange={handleChange}
                  placeholder="e.g. Aathekesavan R"
                  className="form-input"
                />
                {errors.requesterName && <div className="form-error">{errors.requesterName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Requester Role *</label>
                <select
                  name="requesterRole"
                  value={formData.requesterRole}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty Member</option>
                  <option value="STAFF">Campus Staff</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Institutional Email *</label>
                <input
                  type="email"
                  name="requesterEmail"
                  value={formData.requesterEmail}
                  onChange={handleChange}
                  placeholder="e.g. ra2411003050015@srmist.edu.in"
                  className="form-input"
                />
                {errors.requesterEmail && <div className="form-error">{errors.requesterEmail}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone (Optional)</label>
                <input
                  type="tel"
                  name="requesterPhone"
                  value={formData.requesterPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description of Problem *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what occurred, any error messages, affected systems, or observations..."
                className="form-textarea"
                rows="4"
              ></textarea>
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
