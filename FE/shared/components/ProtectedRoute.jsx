import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Hàm giải mã JWT để lấy thông tin Role mà không cần cài thêm thư viện
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

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');

    // Nếu chưa có Token -> Quay về trang Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const decodedPayload = decodeToken(token);
        if (!decodedPayload) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }

        // Lấy Role từ claim của .NET (thường là key role hoặc url schema)
        const userRole = decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedPayload.role;

        // Kiểm tra xem Role của nhân viên có nằm trong danh sách cho phép không
        const hasRequiredRole = allowedRoles.some(
            (role) => role.toLowerCase() === userRole?.toLowerCase()
        );

        if (!hasRequiredRole) {
            alert("Bạn không có quyền truy cập khu vực này!");
            return <Navigate to="/" replace />;
        }
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;