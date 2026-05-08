import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Table, UserCircle } from 'lucide-react';

export default function StaffLayout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside className="glass-panel" style={{ width: '280px', margin: '1rem', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="btn-icon" style={{ background: 'var(--primary-color)', color: '#fff' }}>
            <UserCircle size={32} />
          </div>
          <div>
            <h2 className="heading-3" style={{ margin: 0 }}>Staff Portal</h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Symphony Dining</p>
          </div>
        </div>

        <nav style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { id: '/staff/orders', icon: UtensilsCrossed, label: 'Kitchen & Orders' },
            { id: '/staff/tables', icon: Table, label: 'Table Status' }
          ].map(tab => (
            <Link
              key={tab.id}
              to={tab.id}
              className="btn-secondary"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-start',
                background: location.pathname.includes(tab.id) ? 'var(--primary-color)' : 'transparent',
                color: location.pathname.includes(tab.id) ? '#fff' : 'var(--text-main)',
                borderColor: location.pathname.includes(tab.id) ? 'var(--primary-color)' : 'transparent',
                boxShadow: location.pathname.includes(tab.id) ? '0 4px 15px rgba(245, 158, 11, 0.3)' : 'none'
              }}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </Link>
          ))}
          
          <div style={{ marginTop: 'auto' }}>
            <button 
              onClick={() => window.location.href = '/login'}
              className="btn-danger" style={{ width: '100%', padding: '0.75rem', fontWeight: 600 }}
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
