import React from 'react';

const STEPS = [
  { key: 'OPEN', label: '1. Reported' },
  { key: 'ASSIGNED', label: '2. Assigned' },
  { key: 'IN_PROGRESS', label: '3. In Progress' },
  { key: 'RESOLVED', label: '4. Resolved' },
  { key: 'CLOSED', label: '5. Closed' }
];

export default function StatusStepper({ currentStatus }) {
  const currentIndex = STEPS.findIndex(s => s.key === currentStatus);

  return (
    <div className="timeline-stepper">
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <div
            key={step.key}
            className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="stepper-circle">
              {isCompleted ? '✓' : idx + 1}
            </div>
            <span className="stepper-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
