using BE.Models;
using System.Linq;
using System.Collections.Generic;

namespace BE.Data
{
    public static class DbInitializer
    {
        public static void Initialize(RestaurantDbContext context)
        {
            // Đảm bảo database đã được tạo
            context.Database.EnsureCreated();

            // Kiểm tra và tạo tài khoản Admin
            if (!context.NhanViens.Any(nv => nv.MaNV == "ADMIN001"))
            {
                var admin = new Admin { MaNV = "ADMIN001", HoTen = "Administrator", MatKhau = "123456" };
                context.NhanViens.Add(admin);
            }

            // Kiểm tra và tạo tài khoản Nhân Viên (ThuNgan)
            if (!context.NhanViens.Any(nv => nv.MaNV == "NV001"))
            {
                var staff = new ThuNgan { MaNV = "NV001", HoTen = "Nhân Viên Test", MatKhau = "123456", HoaDonsDaXuLy = new List<HoaDon>() };
                context.NhanViens.Add(staff);
            }

            // Kiểm tra và tạo tài khoản Bếp
            if (!context.NhanViens.Any(nv => nv.MaNV == "BEP001"))
            {
                var kitchen = new Bep { MaNV = "BEP001", HoTen = "Nhân Viên Bếp", MatKhau = "123456" };
                context.NhanViens.Add(kitchen);
            }

            context.SaveChanges();
        }
    }
}