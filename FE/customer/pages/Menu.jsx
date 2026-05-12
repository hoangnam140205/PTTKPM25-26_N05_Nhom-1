import React from 'react';
import { Plus } from 'lucide-react';

export default function Menu({ menu, addToCart }) {
  const categories = [...new Set(menu.map(item => item.category))];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="heading-1" style={{ fontSize: '3rem' }}>Our Menu</h1>
        <p className="text-muted">A curated selection of extraordinary dishes.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {categories.map(category => (
          <div key={category}>
            <h2 className="heading-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              {category}
            </h2>
            <div className="grid-cards">
              {menu.filter(item => item.category === category).map(item => (
                <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 className="heading-3" style={{ fontSize: '1.25rem', margin: 0 }}>{item.name}</h3>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>
                      Chef's special preparation with premium ingredients.
                    </p>
                    <button 
                      onClick={() => addToCart(item)}
                      className="btn-primary" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
                    >
                      <Plus size={18} /> Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
