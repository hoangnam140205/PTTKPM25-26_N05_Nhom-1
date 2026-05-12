import React, { useState } from 'react';
import { Menu, Table, UtensilsCrossed, Clock, DollarSign, Users, BarChart3, CheckCircle2 } from 'lucide-react';
import MenuManagement from '../components/MenuManagement';
import TableManagement from '../components/TableManagement';
import OrderManagement from '../components/OrderManagement';
import AdminReports from '../components/AdminReports';

export default function AdminDashboard({ menu, setMenu, tables, setTables, orders, setOrders }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalMenuItems = menu.length;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', margin: '1rem', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="heading-2" style={{ margin: 0, background: 'linear-gradient(135deg, var(--primary-color), #fcd34d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Symphony
          </h2>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Admin Portal</p>
        </div>

        <nav style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { id: 'menu', icon: Menu, label: 'Menu Management' },
            { id: 'tables', icon: Table, label: 'Table Setup' },
            { id: 'orders', icon: UtensilsCrossed, label: 'Live Orders' },
            { id: 'reports', icon: DollarSign, label: 'Reports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn-secondary"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-start',
                background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-main)',
                borderColor: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(245, 158, 11, 0.3)' : 'none'
              }}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
          <div style={{ marginTop: 'auto' }}>
            <button 
              onClick={() => window.location.href = '/login'}
              className="btn-danger" style={{ width: '100%', padding: '0.75rem', fontWeight: 600 }}
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && (
            <div className="container" style={{ maxWidth: '100%' }}>
              <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 className="heading-1" style={{ fontSize: '2.5rem' }}>Dashboard Overview</h1>
              </div>

              {/* Stats Grid */}
              <div className="grid-cards" style={{ marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div className="flex-between">
                    <div>
                      <p className="text-muted">Total Revenue</p>
                      <p className="heading-2" style={{ margin: 0 }}>${totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="btn-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                      <DollarSign size={32} />
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div className="flex-between">
                    <div>
                      <p className="text-muted">Completed Orders</p>
                      <p className="heading-2" style={{ margin: 0 }}>{completedOrders}</p>
                    </div>
                    <div className="btn-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                      <CheckCircle2 size={32} />
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div className="flex-between">
                    <div>
                      <p className="text-muted">Pending Orders</p>
                      <p className="heading-2" style={{ margin: 0 }}>{pendingOrders}</p>
                    </div>
                    <div className="btn-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--primary-color)' }}>
                      <Clock size={32} />
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div className="flex-between">
                    <div>
                      <p className="text-muted">Menu Items</p>
                      <p className="heading-2" style={{ margin: 0 }}>{totalMenuItems}</p>
                    </div>
                    <div className="btn-icon">
                      <Menu size={32} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h3 className="heading-3">Recent Orders</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="glass-card flex-between" style={{ padding: '1rem' }}>
                        <div>
                          <span style={{ fontWeight: 600 }}>#{order.id}</span>
                          <span className="text-muted" style={{ marginLeft: '1rem', fontSize: '0.875rem' }}>{order.date}</span>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
                          ${order.total.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && <MenuManagement menu={menu} setMenu={setMenu} />}
          {activeTab === 'tables' && <TableManagement tables={tables} setTables={setTables} />}
          {activeTab === 'orders' && <OrderManagement orders={orders} menu={menu} />}
          {activeTab === 'reports' && <AdminReports orders={orders} />}
        </div>
      </main>
    </div>
  );
}
