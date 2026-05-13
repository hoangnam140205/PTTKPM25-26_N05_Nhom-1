import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // State cho Form
  const [formData, setFormData] = useState({ maMon: '', tenMon: '', gia: 0, loai: 'Món chính', hinhAnh: '' });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const data = await axiosClient.get('/admin/MonAn');
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi lấy thực đơn:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ maMon: '', tenMon: '', gia: 0, loai: 'Món chính', hinhAnh: '' });
    }
    setShowModal(true);
  };

  // Hàm chuyển đổi file ảnh tải lên thành chuỗi Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result sẽ là một chuỗi văn bản rất dài chứa toàn bộ dữ liệu ảnh
        setFormData({ ...formData, hinhAnh: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/admin/MonAn/${editingItem.maMon}`, formData);
        alert("Cập nhật món ăn thành công!");
      } else {
        await axiosClient.post('/admin/MonAn', formData);
        alert("Thêm món ăn mới thành công!");
      }
      setShowModal(false);
      fetchMenu();
    } catch (error) {
      alert("Có lỗi xảy ra: " + (error.response?.data?.message || "Vui lòng thử lại"));
    }
  };

  const handleDelete = async (maMon) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món này không?")) {
      try {
        await axiosClient.delete(`/admin/MonAn/${maMon}`);
        fetchMenu();
      } catch (error) {
        alert("Không thể xóa món này!");
      }
    }
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><h2 style={{ color: 'var(--primary-color)' }}>Đang tải thực đơn...</h2></div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        {/* Đã làm đậm và to dòng chữ Quản Lý Thực Đơn */}
        <h1 className="heading-1" style={{ fontSize: '2.5rem', color: '#111827', margin: 0, fontWeight: 'bold' }}>Quản Lý Thực Đơn</h1>

        <button
          onClick={() => handleOpenModal()}
          style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)' }}
        >
          <Plus size={20} /> Thêm Món Mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {menuItems.map((item) => (
          <div key={item.maMon} className="glass-card" style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {item.hinhAnh ? (
                <img src={item.hinhAnh} alt={item.tenMon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={48} color="#9ca3af" />
              )}
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>{item.loai}</span>
                <span style={{ fontWeight: 'bold', color: '#111827', fontSize: '1.125rem' }}>${item.gia.toLocaleString()}</span>
              </div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#111827' }}>{item.tenMon}</h3>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                <button onClick={() => handleOpenModal(item)} style={{ flex: 1, padding: '0.6rem', backgroundColor: 'white', border: '1px solid #d1d5db', color: '#374151', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.3rem', alignItems: 'center', fontWeight: '500' }}>
                  <Edit2 size={16} /> Sửa
                </button>
                <button onClick={() => handleDelete(item.maMon)} style={{ flex: 1, padding: '0.6rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.3rem', alignItems: 'center', fontWeight: '500' }}>
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL THÊM/SỬA - Đã căn giữa và giới hạn chiều cao */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(17, 24, 39, 0.8)', // Làm tối nền hơn để nổi bật tâm điểm
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000, // Số cực lớn để đè lên mọi thứ
          margin: 0,
          padding: 0
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            // Đảm bảo không bị dính các style kế thừa từ cha
            transform: 'none',
          }}>
            <h3 style={{ marginTop: 0, color: '#111827', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              {editingItem ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Mã món</label>
                  <input placeholder="VD: M01" value={formData.maMon} onChange={e => setFormData({ ...formData, maMon: e.target.value })} disabled={editingItem} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Tên món ăn</label>
                  <input placeholder="VD: Phở Bò" value={formData.tenMon} onChange={e => setFormData({ ...formData, tenMon: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Giá bán ($)</label>
                  <input type="number" min="0" step="0.01" value={formData.gia} onChange={e => setFormData({ ...formData, gia: parseFloat(e.target.value) || 0 })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Danh mục</label>
                  <select value={formData.loai} onChange={e => setFormData({ ...formData, loai: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}>
                    <option value="Món chính">Món chính</option>
                    <option value="Khai vị">Khai vị</option>
                    <option value="Tráng miệng">Tráng miệng</option>
                    <option value="Đồ uống">Đồ uống</option>
                  </select>
                </div>
              </div>

              {/* Nút upload file ảnh thay vì nhập link */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Hình ảnh minh họa</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px dashed #9ca3af', boxSizing: 'border-box', cursor: 'pointer' }}
                />

                {/* Khu vực xem trước ảnh sau khi tải lên */}
                {formData.hinhAnh && (
                  <div style={{ marginTop: '1rem', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <img src={formData.hinhAnh} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '0.875rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                  {editingItem ? 'Lưu cập nhật' : 'Tạo món mới'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', padding: '0.875rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}