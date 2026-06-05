import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Banknote, CreditCard, Landmark, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function Checkout({ cart, setCart, onPlaceOrder }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(''); // 'Cash', 'Transfer', 'Visa'
  
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }
    
    setIsPlacing(true);
    try {
      const newOrder = {
        MaBan: null,
        TongTien: total,
        DanhSachChiTiet: cart.reduce((acc, item) => {
          const existing = acc.find(i => i.MaMon === item.id.toString());
          if (existing) {
            existing.SoLuong += 1;
            existing.ThanhTien = existing.SoLuong * item.price;
          } else {
            acc.push({ MaMon: item.id.toString(), SoLuong: 1, ThanhTien: item.price });
          }
          return acc;
        }, [])
      };

      const response = await axiosClient.post('/admin/HoaDon', newOrder);
      
      // Clear cart
      setCart([]);
      
      const orderData = response.data;
      // Set placed order for tracking
      setPlacedOrder(orderData);
      setOrderStatus(orderData.trangThai || 'TiepNhan');

      // Save to recentOrders in localStorage
      if (orderData && orderData.maHD) {
        try {
          let list = [];
          const saved = localStorage.getItem('recentOrders');
          if (saved) {
            list = JSON.parse(saved);
          }
          list = list.filter(item => item !== orderData.maHD);
          list.unshift(orderData.maHD);
          list = list.slice(0, 5);
          localStorage.setItem('recentOrders', JSON.stringify(list));
        } catch (e) {
          console.error("Lỗi lưu recentOrders vào localStorage", e);
        }
      }
    } catch (error) {
      alert('Lỗi đặt hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsPlacing(false);
    }
  };

  useEffect(() => {
    if (!placedOrder) return;

    const interval = setInterval(async () => {
      try {
        const data = await axiosClient.get(`/admin/HoaDon/${placedOrder.maHD}`);
        setOrderStatus(data.trangThai);
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [placedOrder]);

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'TiepNhan': return { text: 'Tiếp nhận', color: '#3b82f6' };
      case 'DangThucHien': return { text: 'Đang thực hiện', color: '#f59e0b' };
      case 'DaHoanThanh': return { text: 'Đã hoàn thành', color: '#10b981' };
      default: return { text: status || 'Đang xử lý', color: '#6b7280' };
    }
  };

  if (placedOrder) {
    const statusInfo = getStatusDisplay(orderStatus);
    return (
      <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', textAlign: 'center' }}>
        <h1 className="heading-1" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Theo dõi đơn hàng</h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Đơn hàng của bạn đã được gửi đến bếp!</p>
        
        <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircle2 size={64} color="var(--success-color)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Mã Hóa Đơn: #{placedOrder.maHD}</h2>
          
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: `2px solid ${statusInfo.color}`,
            width: '100%',
            maxWidth: '400px'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Trạng thái hiện tại</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: statusInfo.color }}>
              {statusInfo.text}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
            <button onClick={() => navigate(`/track-order?id=${placedOrder.maHD}`)} className="btn-primary">
              Theo dõi chi tiết
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '800px' }}>
      <h1 className="heading-1" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Checkout & Payment</h1>

      {cart.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Your cart is empty.</p>
          <button onClick={() => navigate('/menu')} className="btn-primary">Return to Menu</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          {/* Order Summary */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="heading-3" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Order Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {cart.map((item, index) => (
                <div key={index} className="flex-between">
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ paddingTop: '1rem', borderTop: '2px dashed var(--border-color)' }}>
              <div className="flex-between" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex-between" style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <span>Tax (0%):</span>
                <span>$0.00</span>
              </div>
              <div className="flex-between" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                <span>Total:</span>
                <span style={{ color: 'var(--success-color)' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 className="heading-3" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Payment Method
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <button 
                onClick={() => setPaymentMethod('Cash')}
                className="btn-secondary" 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', justifyContent: 'flex-start',
                  border: paymentMethod === 'Cash' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: paymentMethod === 'Cash' ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
                }}
              >
                <Banknote size={24} color={paymentMethod === 'Cash' ? 'var(--primary-color)' : 'var(--text-main)'} />
                <span style={{ fontWeight: paymentMethod === 'Cash' ? 700 : 500 }}>Tiền mặt (Cash)</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('Bank Transfer')}
                className="btn-secondary" 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', justifyContent: 'flex-start',
                  border: paymentMethod === 'Bank Transfer' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: paymentMethod === 'Bank Transfer' ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
                }}
              >
                <Landmark size={24} color={paymentMethod === 'Bank Transfer' ? 'var(--primary-color)' : 'var(--text-main)'} />
                <span style={{ fontWeight: paymentMethod === 'Bank Transfer' ? 700 : 500 }}>Chuyển khoản (Bank Transfer)</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('Visa')}
                className="btn-secondary" 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', justifyContent: 'flex-start',
                  border: paymentMethod === 'Visa' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  background: paymentMethod === 'Visa' ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
                }}
              >
                <CreditCard size={24} color={paymentMethod === 'Visa' ? 'var(--primary-color)' : 'var(--text-main)'} />
                <span style={{ fontWeight: paymentMethod === 'Visa' ? 700 : 500 }}>Thẻ Visa (Visa Card)</span>
              </button>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={!paymentMethod || isPlacing}
              className="btn-primary" 
              style={{ 
                width: '100%', fontSize: '1.25rem', padding: '1rem', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                marginTop: '2rem',
                opacity: (!paymentMethod || isPlacing) ? 0.5 : 1
              }}
            >
              {isPlacing ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />} 
              {isPlacing ? 'Đang xử lý...' : 'Pay & Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
