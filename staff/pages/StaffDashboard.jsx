import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';

export default function StaffDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch recent orders
            const ordersResponse = await fetch('http://localhost:3000/api/orders');
            const ordersData = await ordersResponse.json();

            const staffOrders = ordersData.filter(order => order.staffId === user.id);
            const recent = staffOrders.slice(0, 5);
            setRecentOrders(recent);

            // Calculate stats
            const completed = staffOrders.filter(order => order.status === 'Completed').length;
            const pending = staffOrders.filter(order => order.status !== 'Completed').length;
            const revenue = staffOrders
                .filter(order => order.status === 'Completed')
                .reduce((sum, order) => sum + order.totalAmount, 0);

            setStats({
                totalOrders: staffOrders.length,
                completedOrders: completed,
                pendingOrders: pending,
                totalRevenue: revenue
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '100vh' }}>Loading...</div>;
    }

    return (
        <div className="container mt-5" style={{ marginBottom: '5rem' }}>
            <div className="flex-between mb-5">
                <div>
                    <h1 className="heading-2">Welcome back, {user.name} 👋</h1>
                    <p className="text-muted">Here's what's happening with your orders today</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid-cards mb-5" style={{ maxWidth: '1200px' }}>
                <div className="glass-card p-4">
                    <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex-center" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                            <i className="fas fa-receipt fa-lg"></i>
                        </div>
                        <h3 className="heading-3">Total Orders</h3>
                        <p className="heading-1" style={{ fontSize: '2rem', marginBottom: 0 }}>{stats.totalOrders}</p>
                        <p className="badge badge-warning">{stats.pendingOrders} pending</p>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex-center" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <i className="fas fa-check-circle fa-lg"></i>
                        </div>
                        <h3 className="heading-3">Completed</h3>
                        <p className="heading-1" style={{ fontSize: '2rem', marginBottom: 0 }}>{stats.completedOrders}</p>
                        <p className="badge badge-success">All caught up!</p>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex-center" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255, 166, 43, 0.1)', color: '#FF992B' }}>
                            <i className="fas fa-money-bill-wave fa-lg"></i>
                        </div>
                        <h3 className="heading-3">Revenue</h3>
                        <p className="heading-1" style={{ fontSize: '2rem', marginBottom: 0 }}>${stats.totalRevenue.toFixed(2)}</p>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>From completed orders</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="glass-card" style={{ padding: '2rem' }}>
                <h2 className="heading-3 mb-4">Recent Orders</h2>
                <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <p className="text-muted">No recent orders yet</p>
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="font-bold">#{String(order.id).padStart(6, '0')}</span>
                                        </td>
                                        <td>{order.customerName}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>${order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${order.status === 'Completed'
                                                ? 'badge-success'
                                                : 'badge-warning'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
