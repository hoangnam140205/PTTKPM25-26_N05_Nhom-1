import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Banknote, CreditCard, Landmark } from 'lucide-react';

export default function Checkout({ cart, setCart, onPlaceOrder }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(''); // 'Cash', 'Transfer', 'Visa'
  
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }
    
    // Create order
    const newOrder = {
      id: Date.now(),
      status: 'pending',
      total: total,
      paymentMethod: paymentMethod,
      date: new Date().toISOString().split('T')[0],
      items: cart.reduce((acc, item) => {
        const existing = acc.find(i => i.id === item.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          acc.push({ ...item, quantity: 1 });
        }
        return acc;
      }, [])
    };

    onPlaceOrder(newOrder);
    setCart([]); // clear cart
    alert(`Order placed successfully! Paid via ${paymentMethod}. The kitchen is preparing your meal.`);
    navigate('/');
  };

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
              disabled={!paymentMethod}
              className="btn-primary" 
              style={{ 
                width: '100%', fontSize: '1.25rem', padding: '1rem', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                marginTop: '2rem',
                opacity: !paymentMethod ? 0.5 : 1
              }}
            >
              <CheckCircle2 size={24} /> Pay & Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
