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
        Task<HoaDon> ThanhToanAsync(string maHD, string? maKM);
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

        public async Task<HoaDon> ThanhToanAsync(string maHD, string? maKM)
        {
            // 1. Tìm hóa đơn, nạp kèm Chi Tiết Món và thông tin Bàn
            var hoaDon = await _context.HoaDons
                .Include(hd => hd.DanhSachChiTiet)
                .Include(hd => hd.Ban) 
                .FirstOrDefaultAsync(hd => hd.MaHD == maHD);

            if (hoaDon == null || hoaDon.TrangThai == "DaThanhToan")
                return null;

            // 2. Tính toán lại tổng tiền gốc (phòng hờ dữ liệu bị sai lệch)
            float tongTienGoc = hoaDon.DanhSachChiTiet.Sum(ct => ct.ThanhTien);
            float soTienGiam = 0;

            // 3. Áp dụng Khuyến Mãi (<<extend>>)
            if (!string.IsNullOrWhiteSpace(maKM))
            {
                // Kiểm tra mã: Có tồn tại và Còn hạn hay không?
                var khuyenMai = await _context.KhuyenMais
                    .FirstOrDefaultAsync(km => km.MaKM == maKM.ToUpper() && km.HanSuDung > DateTime.Now);

                if (khuyenMai != null)
                {
                    soTienGiam = tongTienGoc * (khuyenMai.PhanTramGiam / 100f);
                    hoaDon.KhuyenMaiMaKM = khuyenMai.MaKM; // Lưu lại mã đã dùng
                }
                else
                {
                    throw new Exception("Mã khuyến mãi không hợp lệ hoặc đã hết hạn.");
                }
            }

            // Chốt tổng tiền cuối cùng
            hoaDon.TongTien = tongTienGoc - soTienGiam;
            if (hoaDon.TongTien < 0) hoaDon.TongTien = 0;

            // 4. Xử lý trạng thái
            hoaDon.TrangThai = "DaThanhToan";

            // 5. Giải phóng Bàn
            if (hoaDon.Ban != null)
            {
                hoaDon.Ban.TrangThai = "Trong";
            }

            await _context.SaveChangesAsync();
            
            // Trả về hóa đơn để Frontend thực hiện <<include>> In Hóa Đơn
            return hoaDon; 
        }
    }
}