import React from 'react';
import { Outlet } from 'react-router-dom';
import KitchenSidebar from '../components/KitchenSidebar';

export default function KitchenLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.67)' }}>
      <KitchenSidebar />
      <div style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
} ``
