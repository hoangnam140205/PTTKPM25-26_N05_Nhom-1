import React, { useState, useEffect } from 'react';
import { Package, Plus, ClipboardList, Trash2, Save, FileText } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal 1: Thêm Nguyên Liệu (Đã thêm donGia)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ maNL: '', tenNL: '', donViTinh: '', soLuongTon: 0, donGia: 0 });

  // Modal 2: Tạo Phiếu Nhập Kho
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState({
    maPN: '',
    nhaCungCap: '',
    ghiChu: '',
    danhSachChiTiet: [] 
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const data = await axiosClient.get('/admin/Kho/ton-kho');
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi lấy tồn kho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/admin/Kho/nguyen-lieu', newItem);
      alert("Thêm nguyên liệu mới thành công!");
      setIsItemModalOpen(false);
      setNewItem({ maNL: '', tenNL: '', donViTinh: '', soLuongTon: 0, donGia: 0 });
      fetchInventory();
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

  const handleAddImportRow = () => {
    setImportData({
      ...importData,
      danhSachChiTiet: [...importData.danhSachChiTiet, { maNL: '', soLuong: 1, donGia: 0 }]
    });
  };

  const handleImportRowChange = (index, field, value) => {
    const updatedDetails = [...importData.danhSachChiTiet];
    updatedDetails[index][field] = value;
    setImportData({ ...importData, danhSachChiTiet: updatedDetails });
  };

  const handleRemoveImportRow = (index) => {
    const updatedDetails = importData.danhSachChiTiet.filter((_, i) => i !== index);
    setImportData({ ...importData, danhSachChiTiet: updatedDetails });
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (importData.danhSachChiTiet.length === 0) {
      alert("Phiếu nhập phải có ít nhất 1 nguyên liệu!");
      return;
    }

    const hasEmptyNL = importData.danhSachChiTiet.some(item => !item.maNL);
    if (hasEmptyNL) {
      alert("Vui lòng chọn nguyên liệu cho tất cả các dòng!");
      return;
    }

    try {
      const response = await axiosClient.post('/admin/Kho/nhap-kho', importData);
      alert(response.message || "Nhập kho thành công!");
      setIsImportModalOpen(false);
      setImportData({ maPN: '', nhaCungCap: '', ghiChu: '', danhSachChiTiet: [] });
      fetchInventory(); 
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

  const calculateTotalImport = () => {
    return importData.danhSachChiTiet.reduce((sum, item) => sum + ((item.soLuong || 0) * (item.donGia || 0)), 0);
  };

  if (isLoading) return <div className="text-center p-10"><h2 style={{color: '#10b981'}}>Đang tải dữ liệu kho...</h2></div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ fontSize: '2.5rem', color: '#111827', margin: 0, fontWeight: 'bold' }}>Quản Lý Kho</h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setIsItemModalOpen(true)}
            style={{ backgroundColor: 'white', color: '#10b981', border: '1px solid #10b981', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
          >
            <Plus size={20} /> Khai báo nguyên liệu
          </button>
          
          <button 
            onClick={() => {
              const autoCode = 'PN' + Date.now().toString().slice(-6);
              setImportData({ maPN: autoCode, nhaCungCap: '', ghiChu: '', danhSachChiTiet: [{ maNL: '', soLuong: 1, donGia: 0 }] });
              setIsImportModalOpen(true);
            }}
            style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}
          >
            <ClipboardList size={20} /> Tạo Phiếu Nhập Kho
          </button>
        </div>
      </div>

      {/* BẢNG TỒN KHO */}
      <div className="glass-panel" style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1.25rem 1rem', color: '#374151', fontWeight: 'bold' }}>Mã NL</th>
              <th style={{ padding: '1.25rem 1rem', color: '#374151', fontWeight: 'bold' }}>Tên Nguyên Liệu</th>
              <th style={{ padding: '1.25rem 1rem', color: '#374151', fontWeight: 'bold' }}>Đơn vị tính</th>
              <th style={{ padding: '1.25rem 1rem', color: '#374151', fontWeight: 'bold', textAlign: 'right' }}>Số lượng tồn</th>
              <th style={{ padding: '1.25rem 1rem', color: '#374151', fontWeight: 'bold', textAlign: 'right' }}>Giá trị tồn</th>
              <th style={{ padding: '1.25rem 1rem', color: '#374151', fontWeight: 'bold', textAlign: 'center' }}>Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={item.maNL || index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#111827' }}>{item.maNL}</td>
                <td style={{ padding: '1rem', color: '#4b5563', fontWeight: '500' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={18} color="#9ca3af" /> {item.tenNL}
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>{item.donViTinh}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.125rem', textAlign: 'right', color: item.soLuongTon <= 5 ? '#ef4444' : '#10b981' }}>
                  {item.soLuongTon}
                </td>
                
                {/* CỘT GIÁ TRỊ TỒN (THÀNH TIỀN) MỚI THÊM */}
                <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.125rem', textAlign: 'right', color: '#d97706' }}>
                  {(item.giaTriTon || 0).toLocaleString('vi-VN')} VNĐ
                </td>

                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {item.soLuongTon <= 5 ? (
                    <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' }}>Sắp hết</span>
                  ) : (
                    <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' }}>Đủ hàng</span>
                  )}
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                  Kho đang trống. Hãy khai báo nguyên liệu mới.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: THÊM NGUYÊN LIỆU MỚI */}
      {isItemModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
            <h3 style={{ marginTop: 0, color: '#111827', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package color="#10b981" /> Khai báo nguyên liệu
            </h3>
            
            <form onSubmit={handleAddItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Mã Nguyên Liệu</label>
                <input placeholder="VD: NL01" value={newItem.maNL} onChange={e => setNewItem({...newItem, maNL: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Tên Nguyên Liệu</label>
                <input placeholder="VD: Thịt Bò Úc" value={newItem.tenNL} onChange={e => setNewItem({...newItem, tenNL: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Đơn vị tính</label>
                  <input placeholder="VD: Kg, Lít..." value={newItem.donViTinh} onChange={e => setNewItem({...newItem, donViTinh: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                </div>
                {/* THÊM Ô NHẬP ĐƠN GIÁ CHUẨN */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Đơn giá (VNĐ)</label>
                  <input type="number" min="0" step="1000" placeholder="VD: 50000" value={newItem.donGia} onChange={e => setNewItem({...newItem, donGia: parseFloat(e.target.value) || 0})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Lưu vào kho</button>
                <button type="button" onClick={() => setIsItemModalOpen(false)} style={{ flex: 1, backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TẠO PHIẾU NHẬP KHO */}
      {isImportModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="#10b981" /> Phiếu Nhập Kho
              </h2>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>&times;</button>
            </div>
            
            <form onSubmit={handleImportSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Nhà cung cấp (Tùy chọn)</label>
                  <input placeholder="Tên nhà cung cấp..." value={importData.nhaCungCap} onChange={e => setImportData({...importData, nhaCungCap: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Ghi chú phiếu nhập</label>
                  <input placeholder="Ghi chú..." value={importData.ghiChu} onChange={e => setImportData({...importData, ghiChu: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Danh sách hàng nhập</h3>
                  <button type="button" onClick={handleAddImportRow} style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    <Plus size={16} /> Thêm dòng
                  </button>
                </div>

                {importData.danhSachChiTiet.map((item, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr auto', gap: '0.75rem', alignItems: 'end', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Nguyên liệu</label>
                      <select required value={item.maNL} onChange={e => handleImportRowChange(index, 'maNL', e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                        <option value="">-- Chọn NL --</option>
                        {inventory.map(nl => (
                          <option key={nl.maNL} value={nl.maNL}>{nl.tenNL} ({nl.donViTinh})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Số lượng</label>
                      <input type="number" min="0.01" step="0.01" required value={item.soLuong} onChange={e => handleImportRowChange(index, 'soLuong', parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Đơn giá (VNĐ)</label>
                      <input type="number" min="0" step="1000" required value={item.donGia} onChange={e => handleImportRowChange(index, 'donGia', parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Thành tiền</label>
                      <div style={{ padding: '0.6rem', backgroundColor: '#e5e7eb', borderRadius: '6px', fontWeight: 'bold', color: '#374151', textAlign: 'right' }}>
                        {((item.soLuong || 0) * (item.donGia || 0)).toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveImportRow(index)} style={{ padding: '0.6rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {importData.danhSachChiTiet.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic', padding: '1rem 0' }}>Chưa có nguyên liệu nào. Bấm "Thêm dòng" để bắt đầu.</p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '1.25rem' }}>
                  Tổng cộng: <strong style={{ color: '#10b981', fontSize: '1.5rem' }}>{calculateTotalImport().toLocaleString('vi-VN')} VNĐ</strong>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setIsImportModalOpen(false)} style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Hủy Bỏ</button>
                  <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={20} /> Hoàn Tất Nhập Kho
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}