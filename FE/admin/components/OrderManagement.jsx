import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Download } from 'lucide-react';

export default function OrderManagement({ orders }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    let filtered = [...orders];
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    setFilteredOrders(filtered);
  }, [orders, filter, searchQuery]);

  const markAsPaid = (orderId) => {
    if (window.confirm('Mark this order as completed?')) {
      // Logic would go here
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2" style={{ margin: 0 }}>Live Orders</h2>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} /> Export
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
            style={{ width: 'auto', appearance: 'none' }}
          >
            <option value="all" style={{ color: '#000' }}>All Status</option>
            <option value="pending" style={{ color: '#000' }}>Pending</option>
            <option value="completed" style={{ color: '#000' }}>Completed</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600 }}>#{order.id}</td>
                <td>
                  <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="text-muted" style={{ fontSize: '0.875rem' }}>
                  {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
                  ${order.total.toFixed(2)}
                </td>
                <td className="text-muted">{order.date}</td>
                <td>
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => markAsPaid(order.id)}
                      className="btn-icon"
                      style={{ color: 'var(--success-color)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                      title="Mark Completed"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No orders found matching criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
