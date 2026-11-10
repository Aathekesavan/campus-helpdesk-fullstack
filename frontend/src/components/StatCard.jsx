import React from 'react';

export default function StatCard({ title, value, meta, icon, iconBg = '#e0f2fe', iconColor = '#0284c7' }) {
  return (
    <div className="stat-card">
      <div className="stat-card-info">
        <h3>{title}</h3>
        <div className="stat-card-number">{value}</div>
        {meta && <div className="stat-card-meta">{meta}</div>}
      </div>
      <div className="stat-card-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
        {icon}
      </div>
    </div>
  );
}
