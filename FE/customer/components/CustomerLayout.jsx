import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function CustomerLayout({ cartItemCount }) {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: 'rgba(13, 15, 18, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)', padding: '1rem 0'
      }}>
        <div className="container flex-between">
          <Link to="/" className="heading-2" style={{ margin: 0, background: 'linear-gradient(135deg, var(--primary-color), #fcd34d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.75rem' }}>
            Symphony
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: location.pathname === '/' ? 'var(--primary-color)' : 'var(--text-main)', fontWeight: 600, transition: 'color 0.2s' }}>Home</Link>
            <Link to="/menu" style={{ color: location.pathname === '/menu' ? 'var(--primary-color)' : 'var(--text-main)', fontWeight: 600, transition: 'color 0.2s' }}>Menu</Link>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>
            <button 
              onClick={() => {
                // Clear local storage and logout
                localStorage.removeItem('customerOrderInfo');
                window.location.href = '/login';
              }} 
              className="btn-icon" style={{ color: 'var(--text-muted)' }} title="Logout"
            >
              Logout
            </button>
            <Link to="/checkout" className="btn-icon" style={{ position: 'relative', marginLeft: '1rem' }}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px',
                  background: 'var(--primary-color)', color: '#fff',
                  fontSize: '0.75rem', fontWeight: 800, width: '18px', height: '18px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, marginTop: '70px' }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', marginTop: '4rem', textAlign: 'center' }}>
        <p className="text-muted">© 2026 Symphony Premium Dining. All rights reserved.</p>
      </footer>
    </div>
  );
}
