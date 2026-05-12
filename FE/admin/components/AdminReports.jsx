import React from 'react';

export default function AdminReports({ orders }) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container" style={{ padding: 0 }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2" style={{ margin: 0 }}>Financial Reports</h2>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 className="heading-3 text-muted">Total All-Time Revenue</h3>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--success-color)', margin: '1rem 0' }}>
          ${totalRevenue.toFixed(2)}
        </div>
        <p className="text-muted">More detailed charts and exports coming soon.</p>
      </div>
    </div>
  );
}
