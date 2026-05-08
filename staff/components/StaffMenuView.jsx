import React, { useState, useEffect } from 'react';
import { useCart } from '../../shared/context/CartContext';

export default function StaffMenuView({ onNavigate }) {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/menu');
            const data = await response.json();
            setMenu(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        addToCart(item, 1);
        onNavigate('orders');
    };

    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case 'appetizers': return '#f59e0b';
            case 'main courses': return '#10b981';
            case 'beverages': return '#3b82f6';
            case 'desserts': return '#ec4899';
            default: return '#6b7280';
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '100vh' }}>Loading menu...</div>;
    }

    return (
        <div className="container" style={{ padding: '0', maxWidth: '1200px', marginBottom: '5rem' }}>
            {/* Header */}
            <div className="flex-between mb-4">
                <div>
                    <h1 className="heading-2">Menu</h1>
                    <p className="text-muted">Browse our delicious offerings</p>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid-cards">
                {menu.map(item => (
                    <div key={item.id} className="glass-card p-4" style={{ position: 'relative', transition: 'transform 0.3s' }}>
                        <div
                            className="flex-center mb-3"
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: `rgba(${getCategoryColor(item.category)}, 0.1)`,
                                color: getCategoryColor(item.category),
                                margin: '0 auto'
                            }}
                        >
                            <i className="fas fa-utensils fa-2x"></i>
                        </div>

                        <h3 className="heading-3" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            {item.name}
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <span className="badge" style={{ background: getCategoryColor(item.category) }}>
                                {item.category}
                            </span>
                        </div>

                        <p className="text-muted" style={{ marginBottom: '1rem', height: '60px', overflow: 'hidden' }}>
                            {item.description || 'No description available'}
                        </p>

                        <div className="flex-between mb-3">
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF992B' }}>
                                ${item.price.toFixed(2)}
                            </div>
                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                                {item.isAvailable ? 'Available' : 'Sold Out'}
                            </span>
                        </div>

                        <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.isAvailable}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: item.isAvailable ? 'pointer' : 'not-allowed',
                                opacity: item.isAvailable ? 1 : 0.5
                            }}
                        >
                            <i className="fas fa-plus mr-2"></i> Add to Order
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
