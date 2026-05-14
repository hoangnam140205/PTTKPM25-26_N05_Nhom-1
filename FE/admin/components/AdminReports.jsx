import React, { useState, useEffect } from 'react';
import { Menu, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminReports() {
  // 1. Khởi tạo State với giá trị mặc định bằng 0 để tránh lỗi 'undefined'
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalMenuItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Gọi API ngay khi vào trang
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Gọi song song 2 API lấy Món ăn và Hóa đơn (Chỉnh sửa lại URL nếu BE của bạn lưu khác)
      const [monAnRes, hoaDonRes] = await Promise.all([
        axiosClient.get('/admin/MonAn').catch(() => []), // Dùng .catch để nếu BE chưa code xong API này cũng không bị crash web
        axiosClient.get('/HoaDon').catch(() => [])
      ]);

      // Bóc tách dữ liệu (xử lý an toàn nếu API trả về null)
      const menuItems = Array.isArray(monAnRes) ? monAnRes : [];
      const orders = Array.isArray(hoaDonRes) ? hoaDonRes : [];

      // Phân loại trạng thái (Tùy thuộc vào tên biến trong C# của bạn là TrangThai hay Status)
      const completed = orders.filter(o => o.trangThai === 'DaThanhToan' || o.status === 'completed');
      const pending = orders.filter(o => o.trangThai === 'ChuaThanhToan' || o.status === 'pending');

      // Tính tổng doanh thu (Tùy thuộc vào tên biến TongTien trong C#)
      const revenue = completed.reduce((sum, order) => sum + (order.tongTien || order.total || 0), 0);

      // Cập nhật State để vẽ lên UI
      setStats({
        totalRevenue: revenue,
        completedOrders: completed.length,
        pendingOrders: pending.length,
        totalMenuItems: menuItems.length
      });

      // Lấy 5 đơn hàng mới nhất
      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <h2 style={{ color: 'var(--primary-color)' }}>Đang tải dữ liệu báo cáo...</h2>
    </div>;
  }

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2.5rem', color: '#111827' }}>Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid-cards" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>

        <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p className="text-muted" style={{ color: '#4b5563', margin: '0 0 0.5rem 0' }}>Tổng Doanh Thu</p>
              <p
                className="heading-2"
                style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827'
                }}
              >
                {stats.totalRevenue.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </p>
            </div>
            <div className="btn-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '50%' }}>
              <DollarSign size={28} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p className="text-muted" style={{ color: '#4b5563', margin: '0 0 0.5rem 0' }}>Đơn Đã Xong</p>
              <p className="heading-2" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.completedOrders}</p>
            </div>
            <div className="btn-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '50%' }}>
              <CheckCircle2 size={28} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p className="text-muted" style={{ color: '#4b5563', margin: '0 0 0.5rem 0' }}>Đơn Chờ Xử Lý</p>
              <p className="heading-2" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.pendingOrders}</p>
            </div>
            <div className="btn-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '1rem', borderRadius: '50%' }}>
              <Clock size={28} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p className="text-muted" style={{ color: '#4b5563', margin: '0 0 0.5rem 0' }}>Số Lượng Món Ăn</p>
              <p className="heading-2" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.totalMenuItems}</p>
            </div>
            <div className="btn-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '1rem', borderRadius: '50%' }}>
              <Menu size={28} />
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 className="heading-3" style={{ marginTop: 0, marginBottom: '1.5rem', color: '#111827' }}>Hóa đơn gần đây</h3>

          {recentOrders.length === 0 ? (
            <p style={{ color: '#4b5563', fontStyle: 'italic' }}>Chưa có hóa đơn nào trong hệ thống.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentOrders.map((order, index) => (
                <div key={order.id || order.maHD || index} className="glass-card flex-between" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#111827' }}>#{order.id || order.maHD}</span>
                    <span className="text-muted" style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
                      {/* Hiển thị ngày tạo, format lại nếu cần */}
                      {order.date || order.ngayTao ? new Date(order.date || order.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#d97706' }}>
                    ${(order.total || order.tongTien || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}