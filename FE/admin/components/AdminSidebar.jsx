import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Table, DollarSign, Package, Tag, LogOut } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.includes(path);

  const menuItems = [
    { path: '/admin/reports', icon: DollarSign, label: 'Báo Cáo (Reports)' },
    { path: '/admin/menu', icon: Menu, label: 'Thực Đơn (Menu)' },
    { path: '/admin/tables', icon: Table, label: 'Sơ Đồ Bàn (Tables)' },
    // Mở rộng thêm 2 tính năng từ BE
    { path: '/admin/promotions', icon: Tag, label: 'Khuyến Mãi' },
    { path: '/admin/inventory', icon: Package, label: 'Quản Lý Kho' }
  ];

  return (
    <aside className="glass-panel" style={{ width: '280px', margin: '1rem', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
      <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 className="heading-2" style={{ margin: 0, background: 'linear-gradient(135deg, var(--primary-color), #fcd34d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Symphony
        </h2>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Xin chào, <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{user?.name || 'Admin'}</span>
        </p>
      </div>

      <nav style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {menuItems.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className="btn-secondary"
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-start',
              textDecoration: 'none',
              background: isActive(tab.path) ? 'var(--primary-color)' : 'transparent',
              color: isActive(tab.path) ? '#fff' : 'var(--text-main)',
              borderColor: isActive(tab.path) ? 'var(--primary-color)' : 'transparent',
              boxShadow: isActive(tab.path) ? '0 4px 15px rgba(245, 158, 11, 0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </Link>
        ))}
        
        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={handleLogout}
            className="btn-danger" style={{ width: '100%', padding: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <LogOut size={20} />
            Đăng Xuất
          </button>
        </div>
      </nav>
    </aside>
  );
}