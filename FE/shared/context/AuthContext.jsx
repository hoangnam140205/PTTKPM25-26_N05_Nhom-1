import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Khởi tạo Context
const AuthContext = createContext();

// Hàm giải mã JWT để lấy thông tin User (tái sử dụng logic từ ProtectedRoute)
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. Kiểm tra Token khi ứng dụng khởi chạy lần đầu
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded) {
                // Lấy thông tin cần thiết từ Token (ID, Tên, Quyền)
                setUser({
                    id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid,
                    name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.unique_name,
                    role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role
                });
            } else {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    // 3. Hàm Đăng nhập (Sẽ được gọi từ trang Login.jsx)
    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = decodeToken(token);
        setUser({
            id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid,
            name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.unique_name,
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role
        });
    };

    // 4. Hàm Đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Giá trị cung cấp cho toàn bộ ứng dụng
    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook tùy chỉnh để sử dụng AuthContext dễ dàng hơn ở các component khác
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
    }
    return context;
};