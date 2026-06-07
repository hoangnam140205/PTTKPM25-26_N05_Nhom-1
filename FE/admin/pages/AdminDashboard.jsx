import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#111827' }}>
      
      {/* 1. Thanh Sidebar cố định bên trái */}
      <AdminSidebar />

      {/* 2. Khu vực nội dung linh hoạt bên phải */}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        {/* Outlet sẽ tự động render AdminReports, MenuManagement, v.v... dựa trên URL */}
        <Outlet />
      </div>
      
    </div>
  );
}