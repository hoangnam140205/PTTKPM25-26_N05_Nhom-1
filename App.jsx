import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './shared/context/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
import Login from './shared/pages/Login';

import AdminDashboard from './admin/pages/AdminDashboard';
import CustomerLayout from './customer/components/CustomerLayout';
import OrderSetup from './customer/pages/OrderSetup';
import MenuPage from './customer/pages/Menu';
import Checkout from './customer/pages/Checkout';

import StaffLayout from './staff/components/StaffLayout';
import StaffOrders from './staff/pages/Orders';
import StaffTables from './staff/pages/Tables';

// Dummy initial data
const initialMenu = [
  { id: 1, name: 'Truffle Risotto', price: 28.5, category: 'Main Courses', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Wagyu Beef Steak', price: 65.0, category: 'Main Courses', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Lobster Bisque', price: 18.0, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Chocolate Lava Cake', price: 14.0, category: 'Desserts', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop' },
];

const initialTables = [
  { id: 1, number: 'T1', capacity: 2, status: 'available' },
  { id: 2, number: 'T2', capacity: 4, status: 'occupied' },
  { id: 3, number: 'T3', capacity: 6, status: 'available' },
];

const initialOrders = [
  { id: 101, status: 'pending', total: 42.5, paymentMethod: 'Card', date: '2026-05-07', items: [{ name: 'Truffle Risotto', quantity: 1 }, { name: 'Chocolate Lava Cake', quantity: 1 }] },
  { id: 102, status: 'completed', total: 83.0, paymentMethod: 'Cash', date: '2026-05-07', items: [{ name: 'Wagyu Beef Steak', quantity: 1 }, { name: 'Lobster Bisque', quantity: 1 }] },
];

function AppRoutes() {
  const [menu, setMenu] = useState(initialMenu);
  const [tables, setTables] = useState(initialTables);
  const [orders, setOrders] = useState(initialOrders);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handlePlaceOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Customer Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerLayout cartItemCount={cart.length} />
        </ProtectedRoute>
      }>
        <Route index element={<OrderSetup tables={tables} />} />
        <Route path="menu" element={<MenuPage menu={menu} addToCart={addToCart} />} />
        <Route path="checkout" element={<Checkout cart={cart} setCart={setCart} onPlaceOrder={handlePlaceOrder} />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={['staff']}>
          <StaffLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="orders" />} />
        <Route path="orders" element={<StaffOrders orders={orders} setOrders={setOrders} />} />
        <Route path="tables" element={<StaffTables tables={tables} setTables={setTables} />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard 
            menu={menu} setMenu={setMenu}
            tables={tables} setTables={setTables}
            orders={orders} setOrders={setOrders}
          />
        </ProtectedRoute>
      } />
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
