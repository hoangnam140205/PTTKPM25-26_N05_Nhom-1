using BE.Models;
using System.Linq;

namespace BE.Data
{
    public static class DbInitializer
    {
        public static void Initialize(RestaurantDbContext context)
        {
            // Đảm bảo database đã được tạo
            context.Database.EnsureCreated();

            // Kiểm tra xem trong bảng NhanViens đã có tài khoản nào chưa
            if (context.NhanViens.Any())
            {
                return; // Nếu đã có dữ liệu rồi thì thoát, không seed nữa
            }

            // Nếu chưa có, tạo tài khoản Admin mặc định
            // LƯU Ý: Khởi tạo bằng đối tượng 'Admin' để EF Core tự động hiểu và lưu cột Discriminator = 'Admin'
            var admin = new Admin
            {
                MaNV = "AD01",
                HoTen = "Hoàng Phong",
                MatKhau = "123456"
            };

            context.NhanViens.Add(admin);
            context.SaveChanges();
        }
    }
}