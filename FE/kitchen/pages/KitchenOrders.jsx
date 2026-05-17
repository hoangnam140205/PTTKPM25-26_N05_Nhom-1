import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Clock, ChefHat, CheckCircle, RefreshCcw } from 'lucide-react';

export default function KitchenOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await axiosClient.get('/admin/HoaDon');

      // Lọc các đơn hàng chưa hoàn thành để bếp chuẩn bị
      // Trạng thái đơn hàng: "TiepNhan" (Tiếp nhận) -> "DangThucHien" (Đang thực hiện) -> "DaHoanThanh" (Đã hoàn thành)
      const activeOrders = data.filter(order => 
        order.trangThai === 'TiepNhan' || 
        order.trangThai === 'DangThucHien' ||
        order.trangThai === 'ChuaThanhToan' || // Hỗ trợ dữ liệu cũ
        order.trangThai === 'DangNau'
      );

      // Sắp xếp đơn cũ nhất lên trước
      activeOrders.sort((a, b) => new Date(a.ngayTao) - new Date(b.ngayTao));

      setOrders(activeOrders);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto refresh mỗi 30 giây để cập nhật đơn mới
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChangeStatus = async (maHD, newStatus) => {
    try {
      await axiosClient.put(`/admin/HoaDon/${maHD}/trang-thai`, { trangThai: newStatus });
      fetchOrders(); // Refresh lại danh sách
    } catch (error) {
      alert("Lỗi cập nhật trạng thái: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DangThucHien':
      case 'DangNau': 
        return { bg: '#fef3c7', text: '#d97706', label: 'Đang thực hiện', icon: <ChefHat size={16} /> };
      case 'DaHoanThanh':
      case 'ChoPhucVu': 
        return { bg: '#d1fae5', text: '#059669', label: 'Đã hoàn thành', icon: <CheckCircle size={16} /> };
      case 'TiepNhan':
      case 'ChuaThanhToan':
        return { bg: '#eff6ff', text: '#3b82f6', label: 'Tiếp nhận', icon: <Clock size={16} /> };
      default: 
        return { bg: '#f3f4f6', text: '#4b5563', label: status || 'Không rõ', icon: <Clock size={16} /> };
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Đơn Hàng Đang Chế Biến
        </h1>
        <button onClick={fetchOrders} style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#4b5563' }}>
          <RefreshCcw size={18} /> Làm mới
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Đang tải đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '16px', color: '#6b7280', fontSize: '1.25rem' }}>
          Hiện chưa có đơn hàng nào cần chế biến.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {orders.map(order => {
            const statusInfo = getStatusColor(order.trangThai);
            return (
              <div key={order.maHD} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: `4px solid ${statusInfo.text}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', color: '#111827' }}>Mã Đơn: {order.maHD}</h3>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(order.ngayTao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - Bàn: <strong style={{ color: '#111827' }}>{order.ban?.tenBan || order.maBan || 'Mang về'}</strong>
                    </div>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: statusInfo.bg, color: statusInfo.text, padding: '0.5rem 0.75rem', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>

                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Danh sách món:</h4>
                  {order.danhSachChiTiet && order.danhSachChiTiet.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.danhSachChiTiet.map((ct, idx) => (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: idx < order.danhSachChiTiet.length - 1 ? '1px dashed #d1d5db' : 'none', paddingBottom: idx < order.danhSachChiTiet.length - 1 ? '0.5rem' : '0' }}>
                          <span style={{ fontWeight: '500', color: '#111827' }}>{ct.monAn?.tenMon || ct.maMon}</span>
                          <span style={{ fontWeight: 'bold', color: '#f59e0b', fontSize: '1.125rem' }}>x{ct.soLuong}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: '#ef4444', fontStyle: 'italic', fontSize: '0.875rem' }}>Chưa cập nhật chi tiết món!</div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {(order.trangThai === 'TiepNhan' || order.trangThai === 'ChuaThanhToan') && (
                    <button onClick={() => handleChangeStatus(order.maHD, 'DangThucHien')} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                      <ChefHat size={18} /> Bắt đầu nấu
                    </button>
                  )}
                  {(order.trangThai === 'DangThucHien' || order.trangThai === 'DangNau') && (
                    <button onClick={() => handleChangeStatus(order.maHD, 'DaHoanThanh')} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={18} /> Hoàn tất món
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
