import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, Clock, Menu, Receipt, Bell } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function AdminReports() {
  const [stats, setStats] = useState({
    revenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalDishes: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [notifications] = useState([
    { id: 1, message: "Bàn số 3 vừa yêu cầu thanh toán.", time: "Vừa xong", type: "warning" },
    { id: 2, message: "Bếp báo hết nguyên liệu: Thịt bò Úc.", time: "15 phút trước", type: "error" },
    { id: 3, message: "Đã áp dụng mã KHAITRUONG cho Hóa đơn HD012.", time: "1 giờ trước", type: "success" },
    { id: 4, message: "Hệ thống sao lưu dữ liệu thành công.", time: "Hôm qua", type: "info" }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [ordersRes, menuRes] = await Promise.all([
        axiosClient.get('/admin/HoaDon'),
        axiosClient.get('/admin/MonAn')
      ]);

      const orders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.data || []);
      const menu = Array.isArray(menuRes) ? menuRes : (menuRes.data || []);

      let revenue = 0;
      let completed = 0;
      let pending = 0;

      orders.forEach(order => {
        const status = order.trangThai || order.TrangThai;
        const total = order.tongTien || order.TongTien || 0;

        if (status === 'DaThanhToan') {
          revenue += total;
          completed++;
        } else if (status === 'ChuaThanhToan') {
          pending++;
        }
      });

      const sortedOrders = [...orders]
        .sort((a, b) => {
          const dateA = new Date(a.ngayTao || a.NgayTao || 0);
          const dateB = new Date(b.ngayTao || b.NgayTao || 0);
          return dateB - dateA;
        })
        .slice(0, 5);

      setStats({
        revenue,
        completedOrders: completed,
        pendingOrders: pending,
        totalDishes: menu.length
      });
      
      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu Dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center p-10"><h2 style={{color: '#f59e0b'}}>Đang tải dữ liệu tổng quan...</h2></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '2rem' }}>
      
      <h1 className="heading-1" style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 'bold', color: 'white' }}>
        Dashboard Overview
      </h1>

      {/* 4 THẺ THỐNG KÊ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>Tổng Doanh Thu</p>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.875rem', color: '#111827' }}>{stats.revenue.toLocaleString('vi-VN')} VNĐ</h2>
          </div>
          <div style={{ backgroundColor: '#d1fae5', padding: '1rem', borderRadius: '50%', color: '#10b981' }}><DollarSign size={24} /></div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>Đơn Đã Xong</p>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.875rem', color: '#111827' }}>{stats.completedOrders}</h2>
          </div>
          <div style={{ backgroundColor: '#d1fae5', padding: '1rem', borderRadius: '50%', color: '#10b981' }}><CheckCircle size={24} /></div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>Đơn Chờ Xử Lý</p>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.875rem', color: '#111827' }}>{stats.pendingOrders}</h2>
          </div>
          <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '50%', color: '#d97706' }}><Clock size={24} /></div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>Số Lượng Món Ăn</p>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.875rem', color: '#111827' }}>{stats.totalDishes}</h2>
          </div>
          <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '50%', color: '#3b82f6' }}><Menu size={24} /></div>
        </div>
      </div>

      {/* KHU VỰC CHIA CỘT: HÓA ĐƠN & THÔNG BÁO */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* BẢNG HÓA ĐƠN GẦN ĐÂY */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111827' }}>
            <Receipt size={20} color="#f59e0b" /> Hóa đơn gần đây
          </h3>
          {recentOrders.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #10285a', color: '#6b7280', fontSize: '0.875rem' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Mã HĐ</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Trạng thái</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '600', color: '#111827' }}>#{order.maHD || order.MaHD}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {(order.trangThai || order.TrangThai) === 'DaThanhToan' ? (
                          <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem' }}>Đã thanh toán</span>
                        ) : (
                          <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem' }}>Chờ xử lý</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold', color: '#10b981', textAlign: 'right' }}>
                        {(order.tongTien || order.TongTien || 0).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Chưa có hóa đơn nào.</p>
          )}
        </div>

        {/* KHUNG THÔNG BÁO MỚI */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111827' }}>
            <Bell size={20} color="#3b82f6" /> Thông báo hệ thống
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
            {notifications.map((note) => (
              <div key={note.id} style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                borderLeft: `4px solid ${note.type === 'error' ? '#ef4444' : note.type === 'warning' ? '#f59e0b' : note.type === 'success' ? '#10b981' : '#3b82f6'}`,
                backgroundColor: '#f9fafb'
              }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>{note.message}</p>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{note.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}