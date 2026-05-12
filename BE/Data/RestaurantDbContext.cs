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
        }
    }
}