import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Package, Coffee, AlertTriangle } from 'lucide-react';

export default function KitchenInventory() {
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [menuData, inventoryData] = await Promise.all([
        axiosClient.get('/admin/MonAn'),
        axiosClient.get('/admin/Kho/ton-kho')
      ]);
      setMenuItems(menuData);
      setInventory(inventoryData);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleMenuStatus = async (item) => {
    const newStatus = item.trangThai === 'DangBan' || item.trangThai === 'Còn hàng' ? 'Hết hàng' : 'DangBan';

    // We send PUT request to update MonAn. 
    // Need to retain all other properties so we don't accidentally overwrite them.
    const updatedItem = {
      ...item,
      trangThai: newStatus
    };

    try {
      await axiosClient.put(`/admin/MonAn/${item.maMon}`, updatedItem);
      fetchData(); // Refresh to ensure sync
    } catch (error) {
      alert("Lỗi cập nhật trạng thái món: " + (error.response?.data || error.message));
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Đang tải dữ liệu...</div>;

  const outOfStockInventory = inventory.filter(i => i.soLuongTon <= 5);

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', margin: '0 0 2rem 0', color: '#d97706' }}>Quản lý Thực Đơn & Cảnh Báo Kho</h1>

      {/* CẢNH BÁO NGUYÊN LIỆU SẮP HẾT */}
      <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', fontSize: '1.25rem' }}>
          <AlertTriangle size={24} /> Nguyên Liệu Sắp Hết
        </h2>
        {outOfStockInventory.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {outOfStockInventory.map(item => (
              <div key={item.maNL} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a', minWidth: '200px' }}>
                <div style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>{item.tenNL}</div>
                <div style={{ color: '#ef4444', fontWeight: '500' }}>Tồn: {item.soLuongTon} {item.donViTinh}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#92400e' }}>Kho nguyên liệu hiện tại đang ổn định, không có mặt hàng nào sắp hết.</p>
        )}
      </div>

      {/* DANH SÁCH MÓN ĂN - BÁO HẾT HÀNG */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111827', fontSize: '1.25rem' }}>
          <Coffee size={24} color="#10b981" /> Tình Trạng Món Ăn
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {menuItems.map(item => {
            const isAvailable = item.trangThai === 'DangBan' || item.trangThai === 'Còn hàng';
            return (
              <div key={item.maMon} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: isAvailable ? 'white' : '#f9fafb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={item.hinhAnh} alt={item.tenMon} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', opacity: isAvailable ? 1 : 0.5 }} />
                  <div>
                    <div style={{ fontWeight: 'bold', color: isAvailable ? '#111827' : '#9ca3af' }}>{item.tenMon}</div>
                    <div style={{ fontSize: '0.875rem', color: isAvailable ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                      {isAvailable ? 'Còn hàng' : 'Hết hàng'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleMenuStatus(item)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: isAvailable ? '#fee2e2' : '#d1fae5',
                    color: isAvailable ? '#ef4444' : '#059669',
                    transition: 'all 0.2s'
                  }}
                >
                  {isAvailable ? 'Báo Hết' : 'Báo Có'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
