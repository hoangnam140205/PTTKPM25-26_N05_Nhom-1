import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { ChefHat, ListOrdered, Package, LogOut } from 'lucide-react';

export default function KitchenSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: isActive ? '#f59e0b' : '#d1d5db',
    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s',
  });

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#1f2937',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid #374151'
    }}>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #374151' }}>
        <h2 style={{ 
          margin: 0, 
          color: '#fbbf24', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '1.5rem'
        }}>
          <ChefHat size={28} />
          Bếp Symphony
        </h2>
        <p style={{ margin: '0.5rem 0 0 0', color: '#9ca3af', fontSize: '0.875rem' }}>Quản lý chế biến</p>
      </div>

      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/kitchen/orders" style={navLinkStyle}>
          <ListOrdered size={20} /> Đơn Món Ăn
        </NavLink>
        <NavLink to="/kitchen/inventory" style={navLinkStyle}>
          <Package size={20} /> Kho / Thực Đơn
        </NavLink>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={20} /> Đăng Xuất
        </button>
      </div>
    </div>
  );
}
