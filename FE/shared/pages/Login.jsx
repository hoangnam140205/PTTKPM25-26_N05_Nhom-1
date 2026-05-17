import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { LogIn, User, Shield } from 'lucide-react';

const Login = () => {
    const [maNV, setMaNV] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    // Demo Accounts
    const DEMO_ACCOUNTS = {
        admin: { maNV: 'ADMIN001', matKhau: '123456', label: 'Admin' },
        staff: { maNV: 'NV001', matKhau: '123456', label: 'Staff' },
        kitchen: { maNV: 'BEP001', matKhau: '123456', label: 'Kitchen' }
    };

    const handleLogin = async (e, accountData = null) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const credentials = accountData || { maNV, matKhau };

        try {
            const response = await axiosClient.post('/auth/dang-nhap', {
                maNV: credentials.maNV,
                matKhau: credentials.matKhau
            });

            if (response.token) {
                login(response.token);

                const base64Url = response.token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
                
                const userRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;

                if (userRole.toLowerCase() === 'admin') {
                    navigate('/admin/reports'); 
                } else if (userRole.toLowerCase() === 'bep') {
                    navigate('/kitchen/orders');
                } else {
                    navigate('/staff/orders'); 
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#111827',
            backgroundImage: 'radial-gradient(circle at top right, #1f2937, #111827)',
            padding: '1rem'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                {/* Main Login Card */}
                <div style={{ 
                    padding: '2.5rem', 
                    backgroundColor: 'rgba(31, 41, 55, 0.7)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 
                            onClick={() => navigate('/')}
                            title="Về trang chọn món (Order Setup)"
                            style={{ 
                                margin: '0 0 0.5rem 0', 
                                background: 'linear-gradient(135deg, #f59e0b, #fcd34d)', 
                                WebkitBackgroundClip: 'text', 
                                WebkitTextFillColor: 'transparent', 
                                fontSize: '2.5rem', 
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'inline-block'
                            }}
                        >
                            Symphony
                        </h2>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Hệ thống quản lý nhà hàng</p>
                    </div>
                    
                    {error && (
                        <div style={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                            color: '#f87171', 
                            padding: '0.75rem', 
                            borderRadius: '8px', 
                            marginBottom: '1.5rem', 
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={(e) => handleLogin(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1d5db', fontSize: '0.875rem' }}>Mã Nhân Viên</label>
                            <input 
                                type="text" 
                                value={maNV} 
                                onChange={(e) => setMaNV(e.target.value)} 
                                required
                                placeholder="Nhập mã nhân viên..."
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem 1rem', 
                                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                    color: 'white',
                                    border: '1px solid #374151', 
                                    borderRadius: '8px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1d5db', fontSize: '0.875rem' }}>Mật Khẩu</label>
                            <input 
                                type="password" 
                                value={matKhau} 
                                onChange={(e) => setMatKhau(e.target.value)} 
                                required
                                placeholder="••••••••"
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem 1rem', 
                                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                    color: 'white',
                                    border: '1px solid #374151', 
                                    borderRadius: '8px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{ 
                                marginTop: '1rem', 
                                padding: '0.875rem', 
                                background: isLoading ? '#4b5563' : 'linear-gradient(135deg, #d97706, #f59e0b)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: isLoading ? 'not-allowed' : 'pointer', 
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <LogIn size={18} />
                            {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
                        </button>
                    </form>
                </div>

                {/* Demo Accounts Section */}
                <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <p style={{ margin: '0 0 1rem 0', color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center' }}>
                        📋 Tài khoản mẫu:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {/* Admin Account */}
                        <button
                            onClick={(e) => handleLogin(e, DEMO_ACCOUNTS.admin)}
                            disabled={isLoading}
                            style={{
                                padding: '1rem',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '8px',
                                color: '#60a5fa',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                            }}
                        >
                            <Shield size={16} />
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div>Admin: {DEMO_ACCOUNTS.admin.maNV}</div>
                                <div style={{ fontSize: '0.75rem', color: '#93c5fd', opacity: 0.8 }}>Pass: {DEMO_ACCOUNTS.admin.matKhau}</div>
                            </div>
                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>→</span>
                        </button>

                        {/* Staff Account */}
                        <button
                            onClick={(e) => handleLogin(e, DEMO_ACCOUNTS.staff)}
                            disabled={isLoading}
                            style={{
                                padding: '1rem',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                borderRadius: '8px',
                                color: '#4ade80',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                            }}
                        >
                            <User size={16} />
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div>Nhân viên: {DEMO_ACCOUNTS.staff.maNV}</div>
                                <div style={{ fontSize: '0.75rem', color: '#86efac', opacity: 0.8 }}>Pass: {DEMO_ACCOUNTS.staff.matKhau}</div>
                            </div>
                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>→</span>
                        </button>

                        {/* Kitchen Account */}
                        <button
                            onClick={(e) => handleLogin(e, DEMO_ACCOUNTS.kitchen)}
                            disabled={isLoading}
                            style={{
                                padding: '1rem',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                borderRadius: '8px',
                                color: '#fbbf24',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                            }}
                        >
                            <User size={16} />
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <div>Bếp: {DEMO_ACCOUNTS.kitchen.maNV}</div>
                                <div style={{ fontSize: '0.75rem', color: '#fcd34d', opacity: 0.8 }}>Pass: {DEMO_ACCOUNTS.kitchen.matKhau}</div>
                            </div>
                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>→</span>
                        </button>
                    </div>
                </div>

                {/* Info Section */}
                <div style={{ 
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '0.75rem'
                }}>
                    <p>💡 Khách hàng không cần đăng nhập. <br /> Vào menu từ trang chủ để đặt hàng.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;