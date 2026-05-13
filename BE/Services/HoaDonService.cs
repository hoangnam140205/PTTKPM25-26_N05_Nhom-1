using BE.Data;
using BE.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BE.Services
{
    public interface IHoaDonService
    {
        Task<List<HoaDon>> LayDanhSachAsync();
        Task<HoaDon> ThemAsync(HoaDon hoaDon);
        Task<HoaDon> LayThongTinAsync(string id);
        Task<bool> HuyMonAsync(string maHD, string maMon);
        Task<bool> DoiMonAsync(string maHD, string maMonCu, string maMonMoi, int soLuongMoi);
    }

    public class HoaDonService : IHoaDonService
    {
        private readonly RestaurantDbContext _context;

        public HoaDonService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<List<HoaDon>> LayDanhSachAsync()
        {
            return await _context.HoaDons.ToListAsync();
        }

        public async Task<HoaDon> ThemAsync(HoaDon hoaDon)
        {
            _context.HoaDons.Add(hoaDon);
            await _context.SaveChangesAsync();
            return hoaDon;
        }

        public async Task<HoaDon> LayThongTinAsync(string id)
        {
            return await _context.HoaDons
                                 .Include(hd => hd.DanhSachChiTiet) // Lấy luôn cả danh sách món ăn bên trong
                                 .FirstOrDefaultAsync(hd => hd.MaHD == id);
        }

        public async Task<bool> HuyMonAsync(string maHD, string maMon)
        {
            var chiTiet = await _context.ChiTietHoaDons
                                        .FirstOrDefaultAsync(ct => ct.MaHD == maHD && ct.MaMon == maMon);
            if (chiTiet == null) return false;

            // 1. Lấy Hóa đơn cha để trừ tiền
            var hoaDon = await _context.HoaDons.FindAsync(maHD);
            if (hoaDon != null)
            {
                hoaDon.TongTien -= chiTiet.ThanhTien; 
            }

            // 2. Xóa món
            _context.ChiTietHoaDons.Remove(chiTiet);
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DoiMonAsync(string maHD, string maMonCu, string maMonMoi, int soLuongMoi)
        {
            // 1. Tìm dòng chi tiết cũ
            var chiTietCu = await _context.ChiTietHoaDons
                                        .FirstOrDefaultAsync(ct => ct.MaHD == maHD && ct.MaMon == maMonCu);
            if (chiTietCu == null) return false;

            // 2. Kiểm tra món mới có tồn tại trong thực đơn không và lấy giá tiền
            var monMoi = await _context.MonAns.FindAsync(maMonMoi);
            if (monMoi == null) return false; 

            // 3. Tính Thành tiền mới
            var thanhTienMoi = monMoi.GiaTien * soLuongMoi;

            // 4. Lấy Hóa đơn cha để cập nhật tổng tiền
            var hoaDon = await _context.HoaDons.FindAsync(maHD);
            if (hoaDon != null)
            {
                // Tổng tiền = Tổng cũ - Tiền món cũ + Tiền món mới
                hoaDon.TongTien = hoaDon.TongTien - chiTietCu.ThanhTien + thanhTienMoi;
            }

            // 5. EF Core: Phải xóa dòng cũ và tạo dòng mới (Không được phép sửa Khóa chính)
            _context.ChiTietHoaDons.Remove(chiTietCu);

            var chiTietMoi = new ChiTietHoaDon
            {
                MaHD = maHD,
                MaMon = maMonMoi,
                SoLuong = soLuongMoi,
                ThanhTien = thanhTienMoi,
                GhiChu = chiTietCu.GhiChu // Giữ lại ghi chú cũ (nếu có)
            };
            
            _context.ChiTietHoaDons.Add(chiTietMoi);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}