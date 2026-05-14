import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, Calendar, Percent } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({ maKM: '', phanTramGiam: 0, hanSuDung: '' });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const data = await axiosClient.get('/admin/KhuyenMai');
      setPromotions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi lấy danh sách khuyến mãi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      // Chuyển đổi format ngày để hiển thị đúng trên input type="datetime-local"
      const formattedDate = new Date(promo.hanSuDung).toISOString().slice(0, 16);
      setFormData({ maKM: promo.maKM, phanTramGiam: promo.phanTramGiam, hanSuDung: formattedDate });
    } else {
      setEditingPromo(null);
      setFormData({ maKM: '', phanTramGiam: 10, hanSuDung: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        await axiosClient.put(`/admin/KhuyenMai/${editingPromo.maKM}`, formData);
        alert("Cập nhật khuyến mãi thành công!");
      } else {
        await axiosClient.post('/admin/KhuyenMai', formData);
        alert("Thêm mã khuyến mãi mới thành công!");
      }
      setIsModalOpen(false);
      fetchPromotions();
    } catch (error) {
      const errorData = error.response?.data;
      let errorMsg = "Lỗi kết nối hoặc dữ liệu không hợp lệ.";
      if (typeof errorData === 'string') errorMsg = errorData;
      else if (errorData?.message) errorMsg = errorData.message;
      else if (errorData?.title) errorMsg = errorData.title; 
      else if (errorData?.errors) errorMsg = JSON.stringify(errorData.errors);
      alert("⚠️ Lỗi từ Backend:\n" + errorMsg);
    }
  };

  const handleDelete = async (maKM) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mã ${maKM} này không?`)) {
      try {
        await axiosClient.delete(`/admin/KhuyenMai/${maKM}`);
        alert("Xóa thành công!");
        fetchPromotions();
      } catch (error) {
        alert("Không thể xóa khuyến mãi này!");
      }
    }
  };

  if (isLoading) return <div className="text-center p-10"><h2 style={{color: '#f59e0b'}}>Đang tải dữ liệu...</h2></div>;

  const now = new Date();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2.5rem', color: '#111827', margin: 0, fontWeight: 'bold' }}>Quản Lý Khuyến Mãi</h1>
        <button 
          onClick={() => openModal()}
          style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
        >
          <Plus size={20} /> Thêm Mã Mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {promotions.map((promo) => {
          const expiryDate = new Date(promo.hanSuDung);
          const isExpired = expiryDate < now;

          return (
            <div key={promo.maKM} className="glass-card" style={{ 
              backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
              border: `2px solid ${isExpired ? '#fca5a5' : '#a7f3d0'}`, overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ padding: '1rem', backgroundColor: isExpired ? '#fef2f2' : '#ecfdf5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${isExpired ? '#fecaca' : '#d1fae5'}` }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: isExpired ? '#dc2626' : '#059669', letterSpacing: '2px' }}>
                  {promo.maKM}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '99px', backgroundColor: isExpired ? '#fee2e2' : '#d1fae5', color: isExpired ? '#991b1b' : '#065f46' }}>
                  {isExpired ? 'Hết Hạn' : 'Còn Hạn'}
                </span>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '1.1rem' }}>
                  <Percent size={18} color="#f59e0b" /> Giảm giá: <strong style={{ color: '#d97706', fontSize: '1.25rem' }}>{promo.phanTramGiam}%</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                  <Calendar size={18} /> HSD: {expiryDate.toLocaleString('vi-VN')}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem' }}>
                  <button onClick={() => openModal(promo)} style={{ flex: 1, padding: '0.5rem', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                    <Edit2 size={16} /> Sửa
                  </button>
                  <button onClick={() => handleDelete(promo.maKM)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {promotions.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#6b7280', backgroundColor: 'white', borderRadius: '16px' }}>
            Chưa có mã khuyến mãi nào trong hệ thống.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px', boxSizing: 'border-box' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag color="#f59e0b" /> {editingPromo ? 'Sửa Khuyến Mãi' : 'Thêm Mã Mới'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Mã Khuyến Mãi</label>
                <input 
                  placeholder="VD: SALE20, TET2026..." 
                  value={formData.maKM} 
                  onChange={e => setFormData({...formData, maKM: e.target.value.toUpperCase()})} // Ép in hoa luôn trên FE
                  disabled={editingPromo} // Backend chặn không cho sửa mã nên FE cũng khóa lại
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: editingPromo ? '#f3f4f6' : 'white', boxSizing: 'border-box', textTransform: 'uppercase' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Phần trăm giảm (%)</label>
                <input 
                  type="number" 
                  min="1" max="100" 
                  value={formData.phanTramGiam} 
                  onChange={e => setFormData({...formData, phanTramGiam: parseInt(e.target.value) || 0})} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Hạn sử dụng</label>
                <input 
                  type="datetime-local" 
                  value={formData.hanSuDung} 
                  onChange={e => setFormData({...formData, hanSuDung: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Lưu lại</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}