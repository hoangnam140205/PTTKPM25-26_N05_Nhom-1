import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const Login = () => {
    const [maNV, setMaNV] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axiosClient.post('/auth/dang-nhap', {
                maNV: maNV,
                matKhau: matKhau
            });

            if (response.token) {
                login(response.token);

                const base64Url = response.token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
                
                const userRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;

                if (userRole.toLowerCase() === 'admin') {
                    navigate('/admin/reports'); 
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
            backgroundColor: '#111827', // Nền tối giống Admin Sidebar
            backgroundImage: 'radial-gradient(circle at top right, #1f2937, #111827)',
            padding: '1rem'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '420px', 
                padding: '2.5rem', 
                backgroundColor: 'rgba(31, 41, 55, 0.7)', // Kính mờ
                backdropFilter: 'blur(12px)',
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ 
                        margin: '0 0 0.5rem 0', 
                        background: 'linear-gradient(135deg, #f59e0b, #fcd34d)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        fontSize: '2.5rem', 
                        fontWeight: 'bold' 
                    }}>
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

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                            boxShadow: isLoading ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.3)'
                        }}
                    >
                        {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;