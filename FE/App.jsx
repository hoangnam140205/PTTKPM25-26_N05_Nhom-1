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
import TrackOrder from './customer/pages/TrackOrder';

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

// --- STAFF COMPONENTS ---
import StaffLayout from './staff/components/StaffLayout';
import StaffOrders from './staff/pages/StaffOrders';
import StaffTables from './staff/pages/StaffTables';

// --- KITCHEN COMPONENTS ---
import KitchenLayout from './kitchen/pages/KitchenLayout';
import KitchenOrders from './kitchen/pages/KitchenOrders';
import KitchenInventory from './kitchen/pages/KitchenInventory';

// Tạm thời giữ lại Dummy Data cho Customer
const initialMenu = [
  { id: 'M01', name: 'Bít tết sốt tiêu đen', price: 150000, category: 'Main Courses' },
  { id: 'M02', name: 'Salad cá ngừ', price: 65000, category: 'Main Courses' },
  { id: 'M03', name: 'Nước ép dưa hấu', price: 30000, category: 'Drinks' }
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
      
      {/* --- CUSTOMER ROUTES (No Login Required) --- */}
      <Route path="/" element={
        <CustomerLayout cartItemCount={cart.length} />
      }>
        <Route index element={<OrderSetup tables={tables} />} />
        <Route path="menu" element={<MenuPage menu={menu} addToCart={addToCart} />} />
        <Route path="checkout" element={<Checkout cart={cart} setCart={setCart} onPlaceOrder={handlePlaceOrder} />} />
        <Route path="track-order" element={<TrackOrder />} />
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

      {/* --- STAFF ROUTES --- */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={['Staff', 'ThuNgan']}> 
          <StaffLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="orders" />} />
        <Route path="orders" element={<StaffOrders />} />
        <Route path="tables" element={<StaffTables />} />
      </Route>

      {/* --- KITCHEN ROUTES --- */}
      <Route path="/kitchen" element={
        <ProtectedRoute allowedRoles={['Bep']}> 
          <KitchenLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="orders" />} />
        <Route path="orders" element={<KitchenOrders />} />
        <Route path="inventory" element={<KitchenInventory />} />
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