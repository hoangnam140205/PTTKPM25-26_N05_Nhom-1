import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowRightLeft, Combine } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  
  const [formData, setFormData] = useState({ maBan: 0, tenBan: '', trangThai: 'Trong' });

  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', sourceTable: null });
  const [targetTableId, setTargetTableId] = useState('');

  const formatStatus = (status) => {
    switch(status) {
      case 'Trong': return 'Trống';
      case 'CoKhach': return 'Có khách';
      case 'DaDat': return 'Đã đặt';
      default: return status;
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const data = await axiosClient.get('/admin/Ban');
      setTables(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi lấy danh sách bàn:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({ maBan: table.maBan, tenBan: table.tenBan || '', trangThai: table.trangThai || 'Trong' });
    } else {
      setEditingTable(null);
      setFormData({ maBan: 0, tenBan: '', trangThai: 'Trong' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await axiosClient.put(`/admin/Ban/${editingTable.maBan}`, formData);
        alert("Cập nhật bàn thành công!");
      } else {
        await axiosClient.post('/admin/Ban', formData);
        alert("Thêm bàn mới thành công!");
      }
      setIsModalOpen(false);
      fetchTables();
    } catch (error) {
      const errorData = error.response?.data;
      let errorMsg = "Lỗi kết nối hoặc sai đường dẫn API (404/405)";
      
      if (typeof errorData === 'string') errorMsg = errorData;
      else if (errorData?.message) errorMsg = errorData.message;
      else if (errorData?.title) errorMsg = errorData.title; 
      else if (errorData?.errors) errorMsg = JSON.stringify(errorData.errors);

      alert("⚠️ Lỗi từ Backend:\n" + errorMsg);
    }
  };

  const deleteTable = async (maBan) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
      try {
        await axiosClient.delete(`/admin/Ban/${maBan}`);
        fetchTables();
      } catch (error) {
        alert("Không thể xóa bàn này!");
      }
    }
  };

  const openActionModal = (type, table) => {
    setActionModal({ isOpen: true, type, sourceTable: table });
    setTargetTableId('');
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!targetTableId) {
      alert("Vui lòng chọn bàn đích!");
      return;
    }

    try {
      if (actionModal.type === 'transfer') {
        await axiosClient.put(`/admin/Ban/chuyen/${actionModal.sourceTable.maBan}/sang/${targetTableId}`);
        alert("Chuyển bàn thành công!");
      } else if (actionModal.type === 'merge') {
        await axiosClient.put(`/admin/Ban/gop/${actionModal.sourceTable.maBan}/vao/${targetTableId}`);
        alert("Gộp bàn thành công!");
      }
      setActionModal({ isOpen: false, type: '', sourceTable: null });
      fetchTables();
    } catch (error) {
      const errorData = error.response?.data;
      let errorMsg = "Vui lòng kiểm tra lại";
      if (typeof errorData === 'string') errorMsg = errorData;
      else if (errorData?.message) errorMsg = errorData.message;
      else if (errorData?.title) errorMsg = errorData.title; 
      else errorMsg = JSON.stringify(errorData);
      alert("⚠️ Lỗi từ Backend:\n" + errorMsg);
    }
  };

  if (isLoading) return <div className="text-center p-10"><h2 style={{color: '#f59e0b'}}>Đang tải sơ đồ bàn...</h2></div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2.5rem', color: '#111827', margin: 0, fontWeight: 'bold' }}>Sơ Đồ Bàn</h1>
        <button 
          onClick={() => openModal()}
          style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
        >
          <Plus size={20} /> Thêm Bàn Mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {tables.map(table => {
          const isOccupied = table.trangThai === 'CoKhach';
          const isReserved = table.trangThai === 'DaDat';
          
          let borderColor = '#a7f3d0'; 
          let bgColor = '#ecfdf5';
          let headerBorder = '#d1fae5';
          let textColor = '#059669';
          let badgeBg = '#d1fae5';
          let badgeText = '#065f46';

          if (isOccupied) {
            borderColor = '#fca5a5'; 
            bgColor = '#fef2f2';
            headerBorder = '#fecaca';
            textColor = '#dc2626';
            badgeBg = '#fee2e2';
            badgeText = '#991b1b';
          } else if (isReserved) {
            borderColor = '#fcd34d'; 
            bgColor = '#fffbeb';
            headerBorder = '#fde68a';
            textColor = '#d97706';
            badgeBg = '#fef3c7';
            badgeText = '#b45309';
          }
          
          return (
            <div key={table.maBan} className="glass-card" style={{ 
              backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
              border: `2px solid ${borderColor}`, overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ padding: '1rem', backgroundColor: bgColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${headerBorder}` }}>
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor, display: 'block' }}>
                    {table.tenBan || `Bàn số ${table.maBan}`}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Mã HT: {table.maBan}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '99px', backgroundColor: badgeBg, color: badgeText }}>
                  {formatStatus(table.trangThai)}
                </span>
              </div>

              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isOccupied ? '1fr 1fr 1fr' : '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                  
                  <button onClick={() => openModal(table)} style={{ padding: '0.5rem', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    <Edit2 size={14} /> Sửa
                  </button>

                  {isOccupied ? (
                    <>
                      <button onClick={() => openActionModal('transfer', table)} style={{ padding: '0.5rem', backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        <ArrowRightLeft size={14} /> Chuyển
                      </button>
                      <button onClick={() => openActionModal('merge', table)} style={{ padding: '0.5rem', backgroundColor: '#fdf4ff', color: '#d946ef', border: '1px solid #fbcfe8', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        <Combine size={14} /> Gộp
                      </button>
                    </>
                  ) : (
                    <button onClick={() => deleteTable(table.maBan)} style={{ padding: '0.5rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                      <Trash2 size={14} /> Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL THÊM / SỬA BÀN */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px', boxSizing: 'border-box' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingTable ? 'Chỉnh Sửa Bàn' : 'Thêm Bàn Mới'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {editingTable && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Mã Hệ Thống (Không thể sửa)</label>
                  <input value={formData.maBan} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', boxSizing: 'border-box' }} />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Tên / Số Bàn hiển thị</label>
                <input 
                  placeholder="VD: Bàn số 3, Bàn VIP..." 
                  value={formData.tenBan} 
                  onChange={e => setFormData({...formData, tenBan: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Trạng thái (Ép buộc thay đổi)</label>
                <select value={formData.trangThai} onChange={e => setFormData({...formData, trangThai: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}>
                  <option value="Trong">Trống</option>
                  <option value="CoKhach">Có khách</option>
                  <option value="DaDat">Đã đặt</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Lưu lại</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHUYỂN / GỘP BÀN */}
      {actionModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '450px', boxSizing: 'border-box' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.5rem', marginBottom: '1rem', color: actionModal.type === 'transfer' ? '#3b82f6' : '#d946ef' }}>
              {actionModal.type === 'transfer' ? 'Chuyển Bàn' : 'Gộp Bàn'}
            </h3>
            
            <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
              Từ bàn: <strong style={{ color: '#111827' }}>{actionModal.sourceTable?.tenBan || `Bàn số ${actionModal.sourceTable?.maBan}`}</strong>
            </p>

            <form onSubmit={handleActionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontWeight: '500' }}>
                Chọn bàn {actionModal.type === 'transfer' ? 'đích (Bàn trống)' : 'để gộp (Bàn đang phục vụ)'}:
              </label>
              
              <select 
                value={targetTableId} 
                onChange={e => setTargetTableId(e.target.value)} 
                required 
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }}
              >
                <option value="">-- Chọn bàn --</option>
                {tables
                  .filter(t => t.maBan !== actionModal.sourceTable?.maBan)
                  .filter(t => actionModal.type === 'transfer' ? t.trangThai === 'Trong' : t.trangThai === 'CoKhach')
                  .map(t => (
                    <option key={t.maBan} value={t.maBan}>
                      {t.tenBan || `Bàn số ${t.maBan}`}
                    </option>
                  ))
                }
              </select>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: actionModal.type === 'transfer' ? '#3b82f6' : '#d946ef', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Xác nhận</button>
                <button type="button" onClick={() => setActionModal({ isOpen: false, type: '', sourceTable: null })} style={{ flex: 1, backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}>Hủy bỏ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}