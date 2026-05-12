import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, ShoppingBag } from 'lucide-react';

export default function OrderSetup({ tables }) {
  const [orderType, setOrderType] = useState(''); // 'IN' or 'TA'
  const [selectedTable, setSelectedTable] = useState('');
  const navigate = useNavigate();

  const handleStartOrder = () => {
    if (orderType === 'IN' && !selectedTable) return;
    
    // Save selection to localStorage or context
    localStorage.setItem('customerOrderInfo', JSON.stringify({
      type: orderType,
      table: selectedTable
    }));
    
    navigate('/menu');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px' }}>
      <h1 className="heading-1" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '3rem' }}>Welcome to Symphony</h1>
      <p className="text-muted" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.25rem' }}>How would you like to enjoy your meal today?</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div 
          onClick={() => setOrderType('IN')}
          className="glass-card" 
          style={{ 
            padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer',
            border: orderType === 'IN' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
            background: orderType === 'IN' ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface-color)'
          }}
        >
          <Utensils size={48} color={orderType === 'IN' ? 'var(--primary-color)' : 'var(--text-muted)'} style={{ margin: '0 auto 1.5rem' }} />
          <h2 className="heading-2" style={{ margin: 0, color: orderType === 'IN' ? 'var(--primary-color)' : 'var(--text-main)' }}>Dine-In</h2>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>Enjoy your meal at our restaurant</p>
        </div>

        <div 
          onClick={() => { setOrderType('TA'); setSelectedTable(''); }}
          className="glass-card" 
          style={{ 
            padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer',
            border: orderType === 'TA' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
            background: orderType === 'TA' ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface-color)'
          }}
        >
          <ShoppingBag size={48} color={orderType === 'TA' ? 'var(--primary-color)' : 'var(--text-muted)'} style={{ margin: '0 auto 1.5rem' }} />
          <h2 className="heading-2" style={{ margin: 0, color: orderType === 'TA' ? 'var(--primary-color)' : 'var(--text-main)' }}>Take-Away</h2>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>Pick up your order to go</p>
        </div>
      </div>

      {orderType === 'IN' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Select Your Table</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
            {tables.filter(t => t.status === 'available').map(table => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table.number)}
                className={selectedTable === table.number ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '1rem', fontSize: '1.25rem', fontWeight: 700 }}
              >
                {table.number}
              </button>
            ))}
            {tables.filter(t => t.status === 'available').length === 0 && (
              <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center' }}>No tables available right now. Please select Take-Away or wait.</p>
            )}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleStartOrder} 
          disabled={!orderType || (orderType === 'IN' && !selectedTable)}
          className="btn-primary" 
          style={{ fontSize: '1.25rem', padding: '1rem 3rem', opacity: (!orderType || (orderType === 'IN' && !selectedTable)) ? 0.5 : 1 }}
        >
          View Menu & Order
        </button>
      </div>
    </div>
  );
}
