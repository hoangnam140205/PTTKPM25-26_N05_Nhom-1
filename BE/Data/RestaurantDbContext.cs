using System; // Bắt buộc thêm dòng này để dùng DateTime cho Khuyến Mãi
using Microsoft.EntityFrameworkCore;
using BE.Models;

namespace BE.Data
{
    public class RestaurantDbContext : DbContext
    {
        // Constructor bắt buộc để Entity Framework Core có thể truyền cấu hình (Connection String) vào
        public RestaurantDbContext(DbContextOptions<RestaurantDbContext> options) : base(options) { }

        // --- KHAI BÁO CÁC BẢNG (TABLES) TRONG DATABASE ---
        public DbSet<Ban> Bans { get; set; }
        public DbSet<MonAn> MonAns { get; set; }
        public DbSet<KhuyenMai> KhuyenMais { get; set; }
        public DbSet<NhanVien> NhanViens { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<ThuNgan> ThuNgans { get; set; }
        public DbSet<KhachHang> KhachHangs { get; set; }
        public DbSet<HoaDon> HoaDons { get; set; }
        public DbSet<ChiTietHoaDon> ChiTietHoaDons { get; set; }
        public DbSet<NguyenLieu> NguyenLieus { get; set; }
        public DbSet<PhieuNhap> PhieuNhaps { get; set; }
        public DbSet<ChiTietPhieuNhap> ChiTietPhieuNhaps { get; set; }

        // --- CẤU HÌNH NÂNG CAO BẰNG FLUENT API ---
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Gọi base method để đảm bảo các cấu hình mặc định (như Inheritance) hoạt động chuẩn xác
            base.OnModelCreating(modelBuilder);

            // 1. Cấu hình Khóa chính tổ hợp (Composite Key) cho bảng trung gian ChiTietHoaDon
            // Bảng này sẽ dùng chung MaHD và MaMon làm khóa chính để không bị trùng lặp dữ liệu món trong cùng 1 hóa đơn
            modelBuilder.Entity<ChiTietHoaDon>()
                .HasKey(c => new { c.MaHD, c.MaMon });

            // 2. Chống lỗi Cascade Delete nhiều luồng (Lỗi kinh điển khi dùng SQL Server)
            // Cấu hình này nói với SQL Server: Không được tự động xóa Hóa đơn khi xóa tài khoản Thu ngân.
            // Điều này giúp bảo toàn lịch sử doanh thu của quán ăn.
            modelBuilder.Entity<HoaDon>()
                .HasOne(h => h.ThuNgan)
                .WithMany(t => t.HoaDonsDaXuLy)
                .HasForeignKey(h => h.ThuNganMaNV)
                .OnDelete(DeleteBehavior.Restrict);

            // 3. Cấu hình Khóa chính tổ hợp (Composite Key) cho bảng trung gian ChiTietPhieuNhap
            modelBuilder.Entity<ChiTietPhieuNhap>()
                .HasKey(c => new { c.MaPN, c.MaNL });

            // =======================================================
            // --- DATA SEEDING (BƠM DỮ LIỆU MẪU CHO MÁY TÍNH BÀN) ---
            // =======================================================

            // 1. Dữ liệu mẫu Sơ đồ bàn
            modelBuilder.Entity<Ban>().HasData(
                new Ban { MaBan = 1, TenBan = "Bàn số 1", TrangThai = "Trong" },
                new Ban { MaBan = 2, TenBan = "Bàn số 2", TrangThai = "Trong" },
                new Ban { MaBan = 3, TenBan = "Bàn số 3", TrangThai = "Trong" },
                new Ban { MaBan = 4, TenBan = "Bàn VIP 1", TrangThai = "Trong" }
            );

            // 2. Dữ liệu mẫu Kho Nguyên Liệu
            modelBuilder.Entity<NguyenLieu>().HasData(
                new NguyenLieu { MaNL = "NL02", TenNL = "Thịt Bò Úc", DonViTinh = "Kg", SoLuongTon = 0, GiaTriTon = 0 },
                new NguyenLieu { MaNL = "NL03", TenNL = "Cà chua Đà Lạt", DonViTinh = "Kg", SoLuongTon = 0, GiaTriTon = 0 },
                new NguyenLieu { MaNL = "NL04", TenNL = "Bia Heineken", DonViTinh = "Thùng", SoLuongTon = 0, GiaTriTon = 0 }
            );

            // 3. Dữ liệu mẫu Khuyến Mãi
            modelBuilder.Entity<KhuyenMai>().HasData(
                new KhuyenMai { MaKM = "KHAITRUONG", PhanTramGiam = 20, HanSuDung = new DateTime(2026, 12, 31) },
                new KhuyenMai { MaKM = "CHAO_PHONG", PhanTramGiam = 10, HanSuDung = new DateTime(2026, 6, 1) }
            );

            // 4. Dữ liệu mẫu Thực Đơn
            // (Lưu ý: Nếu Model MonAn của bạn có thêm các cột bắt buộc khác như MaLoai, HinhAnh... bạn hãy bổ sung vào đây cho khớp nhé)
            modelBuilder.Entity<MonAn>().HasData(
                new MonAn { 
                    MaMon = "M01", 
                    TenMon = "Bít tết sốt tiêu đen", 
                    GiaTien = 150000, 
                    TrangThai = "DangBan" // Thêm trạng thái vào đây
                },
                new MonAn { 
                    MaMon = "M02", 
                    TenMon = "Salad cá ngừ", 
                    GiaTien = 65000, 
                    TrangThai = "DangBan" 
                },
                new MonAn { 
                    MaMon = "M03", 
                    TenMon = "Nước ép dưa hấu", 
                    GiaTien = 30000, 
                    TrangThai = "DangBan" 
                }
            );
        }
    }
}