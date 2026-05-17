import React from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';

export default function StaffLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar Navigation */}
      <StaffSidebar />

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div className="animate-fade-in" style={{ height: '100%' }}>
          
          <Outlet />

        </div>
      </main>
    </div>
  );
}
