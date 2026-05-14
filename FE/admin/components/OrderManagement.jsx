import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, CheckCircle, Clock, Receipt, RefreshCcw } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho Modal Xem chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // State cho Modal Đổi món
  const [changeItemModal, setChangeItemModal] = useState({ isOpen: false, itemInfo: null });
  const [changeItemData, setChangeItemData] = useState({ maMonMoi: '', soLuongMoi: 1 });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await axiosClient.get('/admin/HoaDon');
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi lấy danh sách hóa đơn:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewOrderDetails = async (maHD) => {
    try {
      setDetailLoading(true);
      setIsDetailModalOpen(true);
      const data = await axiosClient.get(`/admin/HoaDon/${maHD}`);
      setSelectedOrder(data);
    } catch (error) {
      alert("Không thể tải chi tiết hóa đơn!");
      setIsDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // --- API HỦY MÓN ---
  const handleCancelItem = async (maHD, maMon) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy món này khỏi hóa đơn?')) {
      try {
        await axiosClient.delete(`/admin/HoaDon/${maHD}/mon/${maMon}`);
        alert("Hủy món thành công!");
        // Load lại chi tiết hóa đơn và danh sách
        viewOrderDetails(maHD);
        fetchOrders();
      } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || "Không thể hủy món này."));
      }
    }
  };

  // --- API ĐỔI MÓN ---
  const openChangeItemModal = (item) => {
    setChangeItemModal({ isOpen: true, itemInfo: item });
    // Giả định item có số lượng, nếu không có thì mặc định là 1
    setChangeItemData({ maMonMoi: '', soLuongMoi: item.soLuong || 1 });
  };

  const submitChangeItem = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(
        `/admin/HoaDon/${selectedOrder.maHD}/mon/${changeItemModal.itemInfo.maMon}`, 
        changeItemData
      );
      alert("Đổi món thành công!");
      setChangeItemModal({ isOpen: false, itemInfo: null });
      // Load lại dữ liệu
      viewOrderDetails(selectedOrder.maHD);
      fetchOrders();
    } catch (error) {
      alert("Lỗi đổi món: " + (error.response?.data?.message || "Vui lòng kiểm tra lại."));
    }
  };

  if (isLoading) return <div className="text-center p-10"><h2 style={{color: '#f59e0b'}}>Đang tải danh sách hóa đơn...</h2></div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2.5rem', color: '#111827', margin: 0, fontWeight: 'bold' }}>Quản Lý Hóa Đơn</h1>
      </div>

      {/* DANH SÁCH HÓA ĐƠN */}
      <div className="glass-panel" style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', color: '#374151', fontWeight: 'bold' }}>Mã HĐ</th>
              <th style={{ padding: '1rem', color: '#374151', fontWeight: 'bold' }}>Ngày Tạo</th>
              <th style={{ padding: '1rem', color: '#374151', fontWeight: 'bold' }}>Bàn</th>
              <th style={{ padding: '1rem', color: '#374151', fontWeight: 'bold' }}>Tổng Tiền</th>
              <th style={{ padding: '1rem', color: '#374151', fontWeight: 'bold' }}>Trạng Thái</th>
              <th style={{ padding: '1rem', color: '#374151', fontWeight: 'bold', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.maHD} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#111827' }}>#{order.maHD}</td>
                <td style={{ padding: '1rem', color: '#4b5563' }}>
                  {new Date(order.ngayTao).toLocaleString('vi-VN')}
                </td>
                <td style={{ padding: '1rem', color: '#4b5563', fontWeight: '500' }}>
                  {order.maBan ? `Bàn ${order.maBan}` : 'Mang đi'}
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#d97706' }}>
                  ${order.tongTien?.toLocaleString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 'bold',
                    backgroundColor: order.trangThai === 'DaThanhToan' ? '#d1fae5' : '#fef3c7',
                    color: order.trangThai === 'DaThanhToan' ? '#059669' : '#d97706'
                  }}>
                    {order.trangThai === 'DaThanhToan' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {order.trangThai === 'DaThanhToan' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button onClick={() => viewOrderDetails(order.maHD)} style={{ padding: '0.5rem 1rem', backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Eye size={16} /> Chi tiết
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                  Chưa có hóa đơn nào trong hệ thống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT HÓA ĐƠN & DANH SÁCH MÓN */}
      {isDetailModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt color="#f59e0b" /> Chi Tiết Hóa Đơn: #{selectedOrder?.maHD}
              </h2>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>

            {detailLoading ? (
              <p className="text-center">Đang tải chi tiết...</p>
            ) : selectedOrder ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                  <div><strong style={{ color: '#4b5563' }}>Bàn:</strong> {selectedOrder.maBan || 'Không'}</div>
                  <div><strong style={{ color: '#4b5563' }}>Trạng thái:</strong> {selectedOrder.trangThai === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                  <div><strong style={{ color: '#4b5563' }}>Thu ngân:</strong> {selectedOrder.thuNganMaNV || 'N/A'}</div>
                  <div><strong style={{ color: '#4b5563' }}>Tổng tiền:</strong> <span style={{ color: '#d97706', fontWeight: 'bold', fontSize: '1.25rem' }}>${selectedOrder.tongTien?.toLocaleString()}</span></div>
                </div>

                <h3 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', color: '#111827' }}>Danh sách món ăn</h3>
                
                {selectedOrder.danhSachChiTiet && selectedOrder.danhSachChiTiet.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #d1d5db', textAlign: 'left', color: '#4b5563' }}>
                        <th style={{ padding: '0.5rem' }}>Mã Món</th>
                        <th style={{ padding: '0.5rem' }}>Số lượng</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.danhSachChiTiet.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>{item.maMon}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{item.soLuong}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                            {/* Nút Đổi món & Hủy món - Chỉ hiện khi hóa đơn chưa thanh toán */}
                            {selectedOrder.trangThai !== 'DaThanhToan' && (
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => openChangeItemModal(item)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                                  <RefreshCcw size={14} /> Đổi
                                </button>
                                <button onClick={() => handleCancelItem(selectedOrder.maHD, item.maMon)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                                  <Trash2 size={14} /> Hủy
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>Hóa đơn này hiện không có món nào.</p>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL NHỎ: ĐỔI MÓN */}
      {changeItemModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCcw size={20} /> Đổi Món (Bỏ: {changeItemModal.itemInfo?.maMon})
            </h3>
            <form onSubmit={submitChangeItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Mã Món Mới</label>
                <input placeholder="VD: M05" value={changeItemData.maMonMoi} onChange={e => setChangeItemData({...changeItemData, maMonMoi: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Số lượng mới</label>
                <input type="number" min="1" value={changeItemData.soLuongMoi} onChange={e => setChangeItemData({...changeItemData, soLuongMoi: parseInt(e.target.value) || 1})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Xác nhận đổi</button>
                <button type="button" onClick={() => setChangeItemModal({ isOpen: false, itemInfo: null })} style={{ flex: 1, backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}