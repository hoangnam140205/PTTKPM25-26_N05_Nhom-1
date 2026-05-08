import React, { useState, useEffect } from 'react';

export default function StaffTableManagement({ onNavigate }) {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tables');
            const data = await response.json();
            setTables(data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (tableId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'available' ? 'occupied' : 'available';
            const response = await fetch(`http://localhost:3000/api/tables/${tableId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const updatedTable = await response.json();
            setTables(tables.map(t => t.id === tableId ? updatedTable : t));
        } catch (error) {
            console.error('Error updating table status:', error);
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '100vh' }}>Loading tables...</div>;
    }

    return (
        <div className="container" style={{ padding: '0', maxWidth: '1200px', marginBottom: '5rem' }}>
            {/* Header */}
            <div className="flex-between mb-4">
                <div>
                    <h1 className="heading-2">Table Management</h1>
                    <p className="text-muted">Manage table availability</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex-end mb-4">
                <button className="btn-secondary">
                    <i className="fas fa-filter mr-2"></i> Filter by Status
                </button>
            </div>

            {/* Tables Grid */}
            <div className="grid-cards">
                {tables.map(table => (
                    <div
                        key={table.id}
                        className="glass-card p-4"
                        style={{
                            textAlign: 'center',
                            borderTop: `4px solid ${table.status === 'occupied' ? '#ef4444' : '#10b981'}`,
                            transition: 'transform 0.3s'
                        }}
                    >
                        <div className="flex-center mb-3" style={{ width: '80px', height: '80px', borderRadius: '50%', background: `rgba(${table.status === 'occupied' ? '239, 68, 68' : '16, 185, 129'}, 0.1)`, margin: '0 auto' }}>
                            <i className={`fas fa-${table.status === 'occupied' ? 'users' : 'chair'} fa-2x`} style={{ color: table.status === 'occupied' ? '#ef4444' : '#10b981' }}></i>
                        </div>

                        <h3 className="heading-3" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            Table {table.number}
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <span className={`badge ${table.status === 'available' ? 'badge-success' : 'badge-danger'}`}>
                                {table.status.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                            Capacity: {table.capacity} seats
                        </p>

                        <button
                            onClick={() => toggleStatus(table.id, table.status)}
                            className={`btn ${table.status === 'available' ? 'btn-success' : 'btn-danger'} w-full`}
                            style={{ padding: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }}
                        >
                            <i className={`fas fa-${table.status === 'available' ? 'check' : 'times'} mr-2`}></i> 
              Mark {table.status === 'available' ? 'Available' : 'Occupied'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
