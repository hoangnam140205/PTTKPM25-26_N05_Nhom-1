import React, { useState, useEffect } from 'react';

export default function CustomerMenu({ addToCart }) {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/menu');
            const data = await response.json();
            // Sort by category then name
            data.sort((a, b) => {
                if (a.category < b.category) return -1;
                if (a.category > b.category) return 1;
                if (a.name < b.name) return -1;
                return 1;
            });
            setMenu(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategories = () => {
        const categories = new Set(menu.map(item => item.category));
        return ['All', ...categories];
    };

    const filteredMenu = menu.filter(item => {
        const matchesCategory = filter === 'All' || item.category === filter;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div className="loader" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading menu...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '0', maxWidth: '1400px', marginBottom: '5rem' }}>
            {/* Header */}
            <div className="mb-4">
                <h1 className="heading-1" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    Our Menu
                </h1>
                <p className="text-muted" style={{ fontSize: '1.25rem' }}>
                    Discover our culinary creations
                </p>
            </div>

            {/* Controls */}
            <div className="flex-between mb-4" style={{ gap: '1rem' }}>
                {/* Filter */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {getCategories().map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search and View Toggle */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field"
                            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem' }}
                            title="Grid view"
                        >
                            <i className="fas fa-th"></i>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem' }}
                            title="List view"
                        >
                            <i className="fas fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Display */}
            {filteredMenu.length === 0 ? (
                <div className="glass-card p-4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}></i>
                    <p className="text-lg">No menu items found matching your search.</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid-cards' : 'flex-stack'}>
                    {filteredMenu.map(item => (
                        <div
                            key={item.id}
                            className={`glass-card ${viewMode === 'list' ? 'flex-row-responsive items-center' : ''}`}
                            style={{
                                padding: viewMode === 'grid' ? '1.5rem' : '1rem',
                                gap: viewMode === 'grid' ? '1.5rem' : '1rem',
                                alignItems: viewMode === 'list' ? 'center' : 'flex-start',
                                borderTop: `4px solid ${item.category === 'Appetizers' ? '#e67e22' :
                                    item.category === 'Main Courses' ? '#e74c3c' :
                                        item.category === 'Desserts' ? '#9b59b6' :
                                            item.category === 'Beverages' ? '#3498db' : '#2ecc71'
                                    }`
                            }}
                        >
                            {/* Image Placeholder */}
                            <div style={{
                                width: viewMode === 'grid' ? '100%' : '120px',
                                height: viewMode === 'grid' ? '180px' : '100px',
                                flexShrink: 0,
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid #ddd'
                            }}>
                                <i className="fas fa-utensils" style={{ fontSize: '3rem', color: '#b0b0b0' }}></i>
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
                                <div className="flex-between" style={{ flexWrap: viewMode === 'list' ? 'wrap' : 'nowrap' }}>
                                    <h3 className="heading-3" style={{ fontSize: viewMode === 'grid' ? '1.25rem' : '1.1rem', marginBottom: '0' }}>
                                        {item.name}
                                    </h3>
                                    <span className="badge" style={{
                                        background: item.category === 'Appetizers' ? '#e67e22' :
                                            item.category === 'Main Courses' ? '#e74c3c' :
                                                item.category === 'Desserts' ? '#9b59b6' :
                                                    item.category === 'Beverages' ? '#3498db' : '#2ecc71',
                                        fontSize: '0.75rem'
                                    }}>
                                        {item.category}
                                    </span>
                                </div>

                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                    {item.description}
                                </p>

                                <div className="flex-between mt-auto">
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                                        ${item.price.toFixed(2)}
                                    </span>
                                    <button onClick={() => addToCart && addToCart(item)} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
