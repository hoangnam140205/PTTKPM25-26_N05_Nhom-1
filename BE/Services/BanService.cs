using BE.Data;
using BE.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Services
{
    public interface IBanService
    {
        Task<List<Ban>> LayDanhSachAsync();
        Task<Ban> ThemAsync(Ban ban);
        Task<Ban> LayThongTinAsync(int id);
        Task<bool> CapNhatAsync(int id, Ban ban);
        Task<bool> XoaAsync(int id);
        // Giai đoạn 2: Nghiệp vụ nâng cao
        Task<bool> ChuyenBanAsync(int maBanCu, int maBanMoi);
        Task<bool> GopBanAsync(int maBanNguon, int maBanDich);
    }

    public class BanService : IBanService
    {
        private readonly RestaurantDbContext _context;

        public BanService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<List<Ban>> LayDanhSachAsync()
        {
            return await _context.Bans.ToListAsync();
        }

        public async Task<Ban> ThemAsync(Ban ban)
        {
            if (string.IsNullOrEmpty(ban.TrangThai)) ban.TrangThai = "Trong";
            _context.Bans.Add(ban);
            await _context.SaveChangesAsync();
            return ban;
        }

        public async Task<Ban> LayThongTinAsync(int id)
        {
            return await _context.Bans.FindAsync(id);
        }

        public async Task<bool> CapNhatAsync(int id, Ban ban)
        {
            var banCu = await _context.Bans.FindAsync(id);
            if (banCu == null) return false;
            
            // Cập nhật cả Trạng thái và Tên bàn mới
            banCu.TrangThai = ban.TrangThai;
            banCu.TenBan = ban.TenBan; 
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> XoaAsync(int id)
        {
            var ban = await _context.Bans.FindAsync(id);
            if (ban == null) return false;
            _context.Bans.Remove(ban);
            await _context.SaveChangesAsync();
            return true;
        }

        // --- LOGIC CHUYỂN BÀN ---
        public async Task<bool> ChuyenBanAsync(int maBanCu, int maBanMoi)
        {
            var banMoi = await _context.Bans.FindAsync(maBanMoi);
            if (banMoi == null || banMoi.TrangThai != "Trong") return false;

            var hoaDon = await _context.HoaDons
                .FirstOrDefaultAsync(hd => hd.MaBan == maBanCu && hd.TrangThai == "ChuaThanhToan");
            if (hoaDon == null) return false;

            // Đổi bàn trên hóa đơn
            hoaDon.MaBan = maBanMoi;

            // Cập nhật trạng thái 2 bàn
            var banCu = await _context.Bans.FindAsync(maBanCu);
            banCu.TrangThai = "Trong";
            banMoi.TrangThai = "CoKhach";

            await _context.SaveChangesAsync();
            return true;
        }

        // --- LOGIC GỘP BÀN ---
        public async Task<bool> GopBanAsync(int maBanNguon, int maBanDich)
        {
            var hdNguon = await _context.HoaDons
                .Include(hd => hd.DanhSachChiTiet)
                .FirstOrDefaultAsync(hd => hd.MaBan == maBanNguon && hd.TrangThai == "ChuaThanhToan");

            var hdDich = await _context.HoaDons
                .Include(hd => hd.DanhSachChiTiet)
                .FirstOrDefaultAsync(hd => hd.MaBan == maBanDich && hd.TrangThai == "ChuaThanhToan");

            if (hdNguon == null || hdDich == null) return false;

            foreach (var itemNguon in hdNguon.DanhSachChiTiet.ToList())
            {
                var itemDich = hdDich.DanhSachChiTiet
                    .FirstOrDefault(ct => ct.MaMon == itemNguon.MaMon);

                if (itemDich != null)
                {
                    // Nếu bàn đích đã có món này -> Cộng dồn số lượng
                    itemDich.SoLuong += itemNguon.SoLuong;
                    itemDich.ThanhTien += itemNguon.ThanhTien;
                    _context.ChiTietHoaDons.Remove(itemNguon);
                }
                else
                {
                    // Nếu bàn đích chưa có -> Chuyển món sang hóa đơn đích
                    itemNguon.MaHD = hdDich.MaHD;
                }
            }

            hdDich.TongTien += hdNguon.TongTien;
            
            // Xóa hóa đơn cũ và giải phóng bàn nguồn
            _context.HoaDons.Remove(hdNguon);
            var banNguon = await _context.Bans.FindAsync(maBanNguon);
            banNguon.TrangThai = "Trong";

            await _context.SaveChangesAsync();
            return true;
        }
    }
}