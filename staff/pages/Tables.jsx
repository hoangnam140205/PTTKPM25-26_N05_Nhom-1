import React from 'react';
import { Users, UserX } from 'lucide-react';

export default function StaffTables({ tables, setTables }) {
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'occupied' : 'available';
    setTables(tables.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="animate-fade-in container" style={{ padding: 0 }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2.5rem' }}>Floor Plan</h1>
      </div>

      <div className="grid-cards">
        {tables.map(table => (
          <div 
            key={table.id} 
            className="glass-card" 
            style={{ 
              padding: '2rem', 
              textAlign: 'center',
              borderTop: `4px solid ${table.status === 'occupied' ? 'var(--danger-color)' : 'var(--success-color)'}`
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              {table.status === 'occupied' ? (
                <Users size={48} color="var(--danger-color)" style={{ margin: '0 auto' }} />
              ) : (
                <UserX size={48} color="var(--success-color)" style={{ margin: '0 auto' }} />
              )}
            </div>
            
            <h3 className="heading-2" style={{ margin: 0 }}>Table {table.number}</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{table.capacity} Seats</p>
            
            <button 
              onClick={() => toggleStatus(table.id, table.status)}
              className={table.status === 'occupied' ? 'btn-danger' : 'btn-primary'}
              style={{ width: '100%' }}
            >
              Mark {table.status === 'available' ? 'Occupied' : 'Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
