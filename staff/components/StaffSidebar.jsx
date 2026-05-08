import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';

export default function StaffSidebar({ onNavigate, currentPage }) {
    const { user, logout } = useAuth();
    const [activeLink, setActiveLink] = useState(currentPage || 'dashboard');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/orders');
            const data = await response.json();
            const staffOrders = data.filter(order => order.staffId === user.id);
            setOrders(staffOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const pendingOrdersCount = orders.filter(order => order.status !== 'Completed').length;

    const handleLinkClick = (page) => {
        setActiveLink(page);
        onNavigate(page);
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', badge: null },
        { id: 'menu', label: 'Menu', icon: 'fas fa-utensils', badge: null },
        { id: 'orders', label: 'Orders', icon: 'fas fa-receipt', badge: pendingOrdersCount },
        { id: 'tables', label: 'Tables', icon: 'fas fa-chair', badge: null },
        { id: 'customers', label: 'Customers', icon: 'fas fa-users', badge: null },
        { id: 'staff', label: 'Staff', icon: 'fas fa-user-tie', badge: null },
        { id: 'reports', label: 'Reports', icon: 'fas fa-chart-bar', badge: null },
    ];

    return (
        <nav className="staff-sidebar">
            <div className="sidebar-header">
                <h1 className="text-3xl font-bold" style={{ color: '#FF992B' }}>
                    Symphony
                </h1>
                <p className="text-muted">Restaurant Management</p>
            </div>

            <div className="sidebar-user">
                <div className="user-avatar">
                    <i className="fas fa-user fa-lg"></i>
                </div>
                <div className="user-info">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-muted uppercase">Staff</span>
                </div>
            </div>

            <ul className="sidebar-nav">
                {navItems.map(item => (
                    <li key={item.id} className="nav-item">
                        <button
                            onClick={() => handleLinkClick(item.id)}
                            className={`nav-link ${activeLink === item.id ? 'active' : ''}`}
                        >
                            <div className="flex items-center">
                                <i className={`${item.icon} mr-3`} style={{ width: '20px' }}></i>
                                <span>{item.label}</span>
                            </div>
                            {item.badge > 0 && (
                                <span className="badge" style={{ background: '#FF992B' }}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mt-auto px-4">
                <button
                    onClick={() => logout()}
                    className="btn-secondary w-full flex items-center justify-center"
                    style={{ padding: '0.75rem' }}
                >
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
            </div>
        </nav>
    );
}
