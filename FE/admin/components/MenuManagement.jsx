import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

export default function MenuManagement({ menu, setMenu }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditCategory(item.category || '');
  };

  const saveEdit = () => {
    if (!editName || !editPrice) return;
    setMenu(menu.map(item =>
      item.id === editingId ? { ...item, name: editName, price: parseFloat(editPrice), category: editCategory } : item
    ));
    setEditingId(null);
  };

  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenu(menu.filter(item => item.id !== id));
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 className="heading-2" style={{ margin: 0 }}>Menu Items</h2>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="grid-cards">
        {menu.map((item) => (
          <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {editingId === item.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-field"
                  placeholder="Item Name"
                />
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="input-field"
                  placeholder="Price"
                />
                <input
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="input-field"
                  placeholder="Category"
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={saveEdit} className="btn-primary" style={{ flex: 1, padding: '0.5rem' }}>
                    <Save size={18} style={{ margin: '0 auto' }} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>
                    <X size={18} style={{ margin: '0 auto' }} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="heading-3" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                    <span className="badge badge-warning">{item.category}</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button onClick={() => startEdit(item)} className="btn-secondary" style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="btn-danger" style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
