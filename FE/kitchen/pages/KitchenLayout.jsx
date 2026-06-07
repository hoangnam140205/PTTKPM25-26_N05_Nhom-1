import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import KitchenSidebar from '../components/KitchenSidebar';
import axiosClient from '../../api/axiosClient';

export default function KitchenLayout() {
  const [notifications, setNotifications] = useState([]);
  const knownOrderIdsRef = useRef(new Set());
  const isInitializedRef = useRef(false);

  // Web Audio API synthesized chime sound generator
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Tone 1: D5
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.15);
      
      // Tone 2: A5
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.3);
      }, 150);
    } catch (e) {
      console.error("Audio playback blocked or failed:", e);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const checkNewOrders = async () => {
    try {
      const data = await axiosClient.get('/admin/HoaDon');
      if (!Array.isArray(data)) return;

      // Filter active orders that Bep is concerned with
      const activeOrders = data.filter(order => 
        order.trangThai === 'TiepNhan' || 
        order.trangThai === 'ChuaThanhToan' ||
        order.trangThai === 'DangThucHien' ||
        order.trangThai === 'DangNau'
      );

      const currentIds = activeOrders.map(order => order.maHD);

      if (!isInitializedRef.current) {
        // First run: just save existing order IDs silently
        activeOrders.forEach(order => {
          knownOrderIdsRef.current.add(order.maHD);
        });
        isInitializedRef.current = true;
      } else {
        // Subsequent runs: detect new orders
        activeOrders.forEach(order => {
          if (!knownOrderIdsRef.current.has(order.maHD)) {
            // Found a new order! Add to known set
            knownOrderIdsRef.current.add(order.maHD);

            // Display Toast notification
            const newNotif = {
              id: order.maHD,
              maHD: order.maHD,
              ban: order.ban?.tenBan || order.maBan || 'Mang về',
              time: new Date(order.ngayTao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              itemCount: order.danhSachChiTiet?.reduce((sum, item) => sum + item.soLuong, 0) || 0
            };

            setNotifications(prev => [newNotif, ...prev]);
            playNotificationSound();

            // Auto dismiss after 8 seconds
            setTimeout(() => {
              removeNotification(order.maHD);
            }, 8000);
          }
        });
      }
    } catch (error) {
      console.error("Lỗi polling kiểm tra đơn hàng mới ở KitchenLayout:", error);
    }
  };

  useEffect(() => {
    // Run immediate check on mount
    checkNewOrders();

    // Poll every 10 seconds for new orders
    const interval = setInterval(checkNewOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.67)' }}>
      <KitchenSidebar />
      
      {/* Toast Notification Container in Top-Left of content space */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '270px',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '350px',
        pointerEvents: 'none' // Click passes through container
      }}>
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="animate-fade-in"
            style={{
              pointerEvents: 'auto', // Enable pointer events on actual toasts
              background: 'rgba(31, 41, 55, 0.95)',
              backdropFilter: 'blur(10px)',
              borderLeft: '5px solid #f59e0b',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              position: 'relative'
            }}
          >
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              padding: '0.5rem',
              borderRadius: '6px'
            }}>
              <Bell className="animate-bounce" size={20} />
            </div>

            <div style={{ flex: 1, paddingRight: '1rem' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#f9fafb', fontSize: '0.95rem', fontWeight: 700 }}>
                Đơn Hàng Mới!
              </h4>
              <p style={{ margin: '0 0 0.15rem 0', color: '#e5e7eb', fontSize: '0.85rem' }}>
                Mã đơn: <strong style={{ color: '#f59e0b' }}>#{notif.maHD}</strong>
              </p>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.8rem' }}>
                Bàn: {notif.ban} • {notif.itemCount} món • {notif.time}
              </p>
            </div>

            <button 
              onClick={() => removeNotification(notif.id)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                color: '#9ca3af',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f9fafb'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
