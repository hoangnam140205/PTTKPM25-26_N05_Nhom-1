import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function TableManagement({ tables, setTables }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ number: '', capacity: '', status: 'available' });

  const openModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({ number: table.number, capacity: table.capacity, status: table.status });
    } else {
      setEditingTable(null);
      setFormData({ number: '', capacity: '', status: 'available' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTable) {
      setTables(tables.map(t =>
        t.id === editingTable.id ? { ...t, ...formData } : t
      ));
    } else {
      const newTable = {
        id: Date.now(),
        number: formData.number,
        capacity: formData.capacity,
        status: formData.status,
      };
      setTables([...tables, newTable]);
    }
    closeModal();
  };

  const deleteTable = (id) => {
    if (window.confirm('Delete this table?')) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2" style={{ margin: 0 }}>Table Setup</h2>
        <button
          onClick={() => openModal()}
          className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> Add Table
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Table #</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map(table => (
              <tr key={table.id}>
                <td style={{ fontWeight: 600, fontSize: '1.1rem' }}>{table.number}</td>
                <td className="text-muted">{table.capacity} Seats</td>
                <td>
                  <span className={`badge ${table.status === 'occupied' ? 'badge-danger' : 'badge-success'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {table.status === 'occupied' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                    {table.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => openModal(table)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTable(table.id)}
                      className="btn-icon"
                      style={{ color: 'var(--danger-color)' }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tables.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No tables found. Add your first table.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>{editingTable ? 'Edit Table' : 'Add Table'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Table Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Capacity (seats)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                  style={{ appearance: 'none' }}
                >
                  <option value="available" style={{ color: '#000' }}>Available</option>
                  <option value="occupied" style={{ color: '#000' }}>Occupied</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingTable ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
