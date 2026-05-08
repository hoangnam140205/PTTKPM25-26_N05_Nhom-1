import React from 'react';
import { Clock, CheckCircle, ChefHat } from 'lucide-react';

export default function StaffOrders({ orders, setOrders }) {
  const pendingOrders = orders.filter(o => o.status === 'pending');

  const completeOrder = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'completed' } : o));
  };

  return (
    <div className="animate-fade-in container" style={{ padding: 0 }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2.5rem' }}>Kitchen Orders</h1>
      </div>

      <div className="grid-cards">
        {pendingOrders.map(order => (
          <div key={order.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChefHat size={24} color="var(--primary-color)" />
                <span className="heading-3" style={{ margin: 0 }}>Order #{order.id}</span>
              </div>
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} /> Pending
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex-between" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span className="badge" style={{ background: 'var(--surface-color)' }}>x{item.quantity}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => completeOrder(order.id)}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <CheckCircle size={18} /> Mark as Ready
            </button>
          </div>
        ))}

        {pendingOrders.length === 0 && (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', gridColumn: '1 / -1' }}>
            <CheckCircle size={48} color="var(--success-color)" style={{ margin: '0 auto 1rem' }} />
            <h3 className="heading-3">All caught up!</h3>
            <p className="text-muted">There are no pending orders in the kitchen.</p>
          </div>
        )}
      </div>
    </div>
  );
}
