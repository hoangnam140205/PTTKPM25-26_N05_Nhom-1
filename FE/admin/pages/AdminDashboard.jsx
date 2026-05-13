import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div className="animate-fade-in" style={{ height: '100%' }}>
          
          {/* Outlet chính là cái "lỗ hổng" để React Router nhét các component con (Menu, Table, Report...) vào đây */}
          <Outlet />

        </div>
      </main>
    </div>
  );
}