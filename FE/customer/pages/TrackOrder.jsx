import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Clock, ChefHat, CheckCircle2, Receipt, Calendar, ArrowLeft, Loader2, AlertCircle, History } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function TrackOrder() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryOrderId = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(queryOrderId);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);

  // Load recent orders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentOrders');
    if (saved) {
      try {
        setRecentOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi đọc recentOrders từ localStorage", e);
      }
    }
  }, []);

  // Fetch order helper
  const fetchOrderDetails = async (id) => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await axiosClient.get(`/admin/HoaDon/${id.trim()}`);
      setCurrentOrder(data);
      
      // Save to recent orders list if found
      saveToRecentOrders(id.trim());
    } catch (error) {
      console.error("Lỗi tra cứu đơn hàng:", error);
      setCurrentOrder(null);
      setErrorMessage(error.response?.data || 'Không tìm thấy đơn hàng này. Vui lòng kiểm tra lại mã!');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to save order to recent list
  const saveToRecentOrders = (id) => {
    let list = [];
    const saved = localStorage.getItem('recentOrders');
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {}
    }
    // Remove if already exists to move to top
    list = list.filter(item => item !== id);
    list.unshift(id);
    list = list.slice(0, 5); // Keep last 5 orders
    localStorage.setItem('recentOrders', JSON.stringify(list));
    setRecentOrders(list);
  };

  // Auto fetch on mount if query param is set
  useEffect(() => {
    if (queryOrderId) {
      setOrderIdInput(queryOrderId);
      fetchOrderDetails(queryOrderId);
    } else {
      setCurrentOrder(null);
    }
  }, [queryOrderId]);

  // Polling for live status updates if order is active
  useEffect(() => {
    if (!currentOrder) return;
    
    // Stop polling if order is fully completed or paid
    const isFinished = currentOrder.trangThai === 'DaThanhToan' || currentOrder.trangThai === 'DaHoanThanh';
    if (isFinished) return;

    const interval = setInterval(async () => {
      try {
        const data = await axiosClient.get(`/admin/HoaDon/${currentOrder.maHD}`);
        setCurrentOrder(data);
      } catch (e) {
        console.error("Lỗi cập nhật tự động:", e);
      }
    }, 6000); // Poll every 6 seconds

    return () => clearInterval(interval);
  }, [currentOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    setSearchParams({ id: orderIdInput.trim() });
  };

  const handleSelectRecent = (id) => {
    setOrderIdInput(id);
    setSearchParams({ id });
  };

  const clearRecentOrders = () => {
    localStorage.removeItem('recentOrders');
    setRecentOrders([]);
  };

  // Status mapping
  const getStatusStep = (status) => {
    switch (status) {
      case 'TiepNhan':
      case 'ChuaThanhToan':
        return 1;
      case 'DangThucHien':
      case 'DangNau':
        return 2;
      case 'DaHoanThanh':
      case 'ChoPhucVu':
        return 3;
      case 'DaThanhToan':
        return 4;
      default:
        return 1;
    }
  };

  const steps = [
    { level: 1, label: 'Tiếp nhận', icon: <Clock size={20} />, desc: 'Bếp đã nhận đơn hàng' },
    { level: 2, label: 'Đang nấu', icon: <ChefHat size={20} />, desc: 'Đầu bếp đang chuẩn bị món' },
    { level: 3, label: 'Hoàn thành', icon: <CheckCircle2 size={20} />, desc: 'Món ăn đã sẵn sàng phục vụ' },
    { level: 4, label: 'Thanh toán', icon: <Receipt size={20} />, desc: 'Đơn hàng đã hoàn tất hóa đơn' }
  ];

  const currentStepLevel = currentOrder ? getStatusStep(currentOrder.trangThai) : 0;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/')} 
          className="btn-icon" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="heading-2" style={{ margin: 0 }}>Tra Cứu Đơn Hàng</h1>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Kiểm tra trạng thái chuẩn bị món ăn từ nhà bếp</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Search & Order info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Search Card */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Nhập mã đơn hàng của bạn
            </h3>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input 
                  type="text" 
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="Ví dụ: HD328905..." 
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Search size={18} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Tra cứu'}
              </button>
            </form>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="glass-panel" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary-color)' }} />
              <p className="text-muted">Đang tải thông tin đơn hàng của bạn...</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && !isLoading && (
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', borderColor: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
              <AlertCircle size={32} style={{ color: 'var(--danger-color)', flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>Tra cứu thất bại</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Order Details Panel */}
          {currentOrder && !isLoading && (
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Order Metadata */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                <div>
                  <span className="badge badge-warning" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                    {currentOrder.trangThai === 'DaThanhToan' ? 'Đã hoàn tất' : 'Đang xử lý'}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
                    Đơn hàng #{currentOrder.maHD}
                  </h2>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                    <Calendar size={14} />
                    <span>{new Date(currentOrder.ngayTao).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  <div>Bàn: <strong style={{ color: 'var(--text-main)' }}>{currentOrder.ban?.tenBan || currentOrder.maBan || 'Mang về'}</strong></div>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h4 style={{ margin: '0 0 1.5rem 0', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Trạng thái chuẩn bị
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem' }}>
                  {/* Timeline vertical bar */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '9px', 
                    top: '12px', 
                    bottom: '12px', 
                    width: '2px', 
                    backgroundColor: 'rgba(255,255,255,0.1)' 
                  }} />

                  {/* Highlighted portion of vertical bar */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '9px', 
                    top: '12px', 
                    height: `${Math.max(0, (currentStepLevel - 1) * 33)}%`, 
                    width: '2px', 
                    backgroundColor: 'var(--primary-color)',
                    transition: 'height 0.5s ease'
                  }} />

                  {steps.map((step) => {
                    const isDone = currentStepLevel >= step.level;
                    const isCurrent = currentStepLevel === step.level;
                    
                    return (
                      <div key={step.level} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', position: 'relative' }}>
                        
                        {/* Circle Indicator */}
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%', 
                          backgroundColor: isDone ? 'var(--primary-color)' : '#1f2937',
                          border: isCurrent ? '4px solid rgba(245, 158, 11, 0.3)' : '2px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                          marginLeft: '-24px',
                          color: '#fff',
                          transform: isCurrent ? 'scale(1.25)' : 'none',
                          transition: 'all 0.3s ease'
                        }}>
                          {isDone && <div style={{ width: '6px', height: '6px', backgroundColor: '#fff', borderRadius: '50%' }} />}
                        </div>

                        {/* Icon Container */}
                        <div style={{ 
                          padding: '0.5rem', 
                          borderRadius: '8px', 
                          backgroundColor: isDone ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)',
                          color: isDone ? 'var(--primary-color)' : 'var(--text-muted)',
                          border: `1px solid ${isDone ? 'rgba(245, 158, 11, 0.2)' : 'var(--border-color)'}`
                        }}>
                          {step.icon}
                        </div>

                        {/* Text */}
                        <div>
                          <h5 style={{ margin: '0 0 0.15rem 0', fontSize: '1.05rem', fontWeight: 600, color: isDone ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {step.label} {isCurrent && <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 500, marginLeft: '0.5rem' }}>(Hiện tại)</span>}
                          </h5>
                          <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Summary */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Chi tiết thực đơn
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentOrder.danhSachChiTiet && currentOrder.danhSachChiTiet.map((ct, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: idx < currentOrder.danhSachChiTiet.length - 1 ? '1px dashed var(--border-color)' : 'none', paddingBottom: idx < currentOrder.danhSachChiTiet.length - 1 ? '0.75rem' : '0' }}>
                      <div>
                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{ct.monAn?.tenMon || ct.maMon}</span>
                        <span className="text-muted" style={{ fontSize: '0.85rem', marginLeft: '0.5rem' }}>x{ct.soLuong}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                        {ct.thanhTien.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}

                  {/* Total pricing */}
                  <div style={{ borderTop: '2px solid var(--border-color)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem' }}>Tổng thanh toán:</span>
                    <span style={{ fontWeight: 800, color: 'var(--success-color)', fontSize: '1.4rem' }}>
                      {currentOrder.tongTien.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Right Column: Recent Searches */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <History size={18} className="text-muted" /> Tra cứu gần đây
            </h3>
            {recentOrders.length > 0 && (
              <button 
                onClick={clearRecentOrders} 
                style={{ fontSize: '0.8rem', color: 'var(--danger-color)', opacity: 0.8, cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.8}
              >
                Xóa sạch
              </button>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: '1rem 0', fontStyle: 'italic', textAlign: 'center' }}>
              Chưa có mã đơn hàng nào được lưu.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentOrders.map((id) => (
                <button
                  key={id}
                  onClick={() => handleSelectRecent(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: id === currentOrder?.maHD ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: id === currentOrder?.maHD ? 'var(--primary-color)' : 'var(--text-main)',
                    textAlign: 'left',
                    fontWeight: id === currentOrder?.maHD ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (id !== currentOrder?.maHD) {
                      e.target.style.backgroundColor = 'var(--surface-hover)';
                      e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (id !== currentOrder?.maHD) {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.02)';
                      e.target.style.borderColor = 'var(--border-color)';
                    }
                  }}
                >
                  <span>#{id}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                    Xem lại
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
