import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './shared/context/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import Login from './shared/pages/Login';

// --- CUSTOMER COMPONENTS ---
import CustomerLayout from './customer/components/CustomerLayout';
import OrderSetup from './customer/pages/OrderSetup';
import MenuPage from './customer/pages/Menu';
import Checkout from './customer/pages/Checkout';

// --- ADMIN COMPONENTS ---
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminReports from './admin/components/AdminReports';
import MenuManagement from './admin/components/MenuManagement';
import TableManagement from './admin/components/TableManagement';
import OrderManagement from './admin/components/OrderManagement';
import InventoryManagement from './admin/components/InventoryManagement';
import PromotionManagement from './admin/components/PromotionManagement';
// Tạm thời comment 2 file này lại cho đến khi bạn thực sự tạo file vật lý
// import InventoryManagement from './admin/components/InventoryManagement';
// import PromotionManagement from './admin/components/PromotionManagement';

// Tạm thời giữ lại Dummy Data cho Customer
const initialMenu = [
  { id: 1, name: 'Truffle Risotto', price: 28.5, category: 'Main Courses' },
  { id: 2, name: 'Wagyu Beef Steak', price: 65.0, category: 'Main Courses' },
];
const initialTables = [
  { id: 1, number: 'T1', capacity: 2, status: 'available' },
];

function AppRoutes() {
  const [menu] = useState(initialMenu);
  const [tables] = useState(initialTables);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => setCart([...cart, item]);
  const handlePlaceOrder = (newOrder) => console.log("Đơn hàng mới:", newOrder);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Navigate to="/login" />} />
      
      {/* --- CUSTOMER ROUTES --- */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerLayout cartItemCount={cart.length} />
        </ProtectedRoute>
      }>
        <Route index element={<OrderSetup tables={tables} />} />
        <Route path="menu" element={<MenuPage menu={menu} addToCart={addToCart} />} />
        <Route path="checkout" element={<Checkout cart={cart} setCart={setCart} onPlaceOrder={handlePlaceOrder} />} />
      </Route>

      {/* --- ADMIN ROUTES --- */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['Admin']}> 
          <AdminDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="reports" />} />
        
        <Route path="reports" element={<AdminReports />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="tables" element={<TableManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        
        {/* Sẽ mở ra khi bạn tạo xong 2 component này */}
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="promotions" element={<PromotionManagement />} /> */
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}