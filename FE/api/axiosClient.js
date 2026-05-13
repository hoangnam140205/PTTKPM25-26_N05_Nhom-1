import axios from 'axios';

// 1. Khởi tạo một bản sao của Axios với các cấu hình mặc định
const axiosClient = axios.create({
    // TODO: Bạn nhớ thay đổi port (số 5000/5001...) cho khớp với đường dẫn BE của bạn khi chạy Swagger nhé
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. CẤU HÌNH REQUEST INTERCEPTOR (Bảo vệ chiều đi)
// Trạm kiểm soát này sẽ tự động chạy TRƯỚC KHI bất kỳ API nào được gửi lên BE
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy tấm vé (Token) mà chúng ta cất trong trình duyệt lúc đăng nhập
        const token = localStorage.getItem('token');
        
        if (token) {
            // Nếu có vé, tự động kẹp nó vào phần Header của Request
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. CẤU HÌNH RESPONSE INTERCEPTOR (Bảo vệ chiều về)
// Trạm kiểm soát này sẽ tự động chạy SAU KHI BE trả kết quả về cho FE
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu BE trả về thành công (Mã 2xx), ta bóc vỏ luôn và chỉ lấy phần data
        // Việc này giúp các file UI gọi API không phải viết .data nhiều lần
        if (response && response.data !== undefined) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // Xử lý các lỗi phổ biến từ Backend trả về
        if (error.response) {
            const status = error.response.status;
            
            if (status === 401) {
                // Lỗi 401 Unauthorized: Cố tình gọi API Admin nhưng không có Token hoặc Token hết hạn
                console.error("Phiên đăng nhập hết hạn hoặc bạn không có quyền!");
                
                // Xóa vé cũ đi
                localStorage.removeItem('token');
                
                // Tự động đá người dùng văng ra trang Đăng nhập
                window.location.href = '/admin/login';
            } else if (status === 403) {
                // Lỗi 403 Forbidden: Có Token nhưng sai Role (vd: Thu ngân cố tình vào Quản lý kho)
                alert("Bạn không có quyền truy cập chức năng này!");
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient;