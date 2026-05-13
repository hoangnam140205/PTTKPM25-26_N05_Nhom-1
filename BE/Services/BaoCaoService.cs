using BE.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Services
{
    // --- Các đối tượng DTO định dạng dữ liệu trả về ---
    public class DoanhThuNgayDto
    {
        public DateTime Ngay { get; set; }
        public float TongDoanhThu { get; set; }
        public int TongSoDon { get; set; }
    }

    public class MonBanChayDto
    {
        public string TenMon { get; set; }
        public int TongSoLuongBan { get; set; }
        public float TongDoanhThuMon { get; set; }
    }

    // --- Định nghĩa Interface ---
    public interface IBaoCaoService
    {
        Task<float> TinhDoanhThuHomNayAsync();
        Task<List<DoanhThuNgayDto>> ThongKeDoanhThuAsync(DateTime tuNgay, DateTime denNgay);
        Task<List<MonBanChayDto>> TopMonBanChayAsync(DateTime tuNgay, DateTime denNgay, int top = 5);
    }

    // --- Triển khai Logic ---
    public class BaoCaoService : IBaoCaoService
    {
        private readonly RestaurantDbContext _context;

        public BaoCaoService(RestaurantDbContext context)
        {
            _context = context;
        }

        // 1. Tính nhanh doanh thu của ngày hôm nay (Dùng cho Dashboard chính)
        public async Task<float> TinhDoanhThuHomNayAsync()
        {
            var homNay = DateTime.Today;
            // Lưu ý: Chỉ tính những hóa đơn có trạng thái "DaThanhToan"
            return await _context.HoaDons
                .Where(hd => hd.NgayTao.Date == homNay && hd.TrangThai == "DaThanhToan")
                .SumAsync(hd => hd.TongTien);
        }

        // 2. Thống kê biểu đồ doanh thu theo một khoảng thời gian (Từ ngày -> Đến ngày)
        public async Task<List<DoanhThuNgayDto>> ThongKeDoanhThuAsync(DateTime tuNgay, DateTime denNgay)
        {
            return await _context.HoaDons
                .Where(hd => hd.NgayTao.Date >= tuNgay.Date && hd.NgayTao.Date <= denNgay.Date && hd.TrangThai == "DaThanhToan")
                .GroupBy(hd => hd.NgayTao.Date) // Gom nhóm tất cả hóa đơn có cùng ngày tạo
                .Select(g => new DoanhThuNgayDto
                {
                    Ngay = g.Key,
                    TongDoanhThu = g.Sum(hd => hd.TongTien), // Tính tổng tiền trong ngày đó
                    TongSoDon = g.Count()                    // Đếm số lượng đơn trong ngày
                })
                .OrderBy(x => x.Ngay) // Sắp xếp từ ngày cũ đến ngày mới
                .ToListAsync();
        }

        // 3. Thống kê top các món bán chạy nhất để ra quyết định nhập kho
        public async Task<List<MonBanChayDto>> TopMonBanChayAsync(DateTime tuNgay, DateTime denNgay, int top = 5)
        {
            return await _context.ChiTietHoaDons
                .Include(ct => ct.HoaDon) // Nối bảng HoaDon để lọc theo ngày và trạng thái
                .Include(ct => ct.MonAn)  // Nối bảng MonAn để lấy tên món
                .Where(ct => ct.HoaDon.NgayTao.Date >= tuNgay.Date 
                          && ct.HoaDon.NgayTao.Date <= denNgay.Date 
                          && ct.HoaDon.TrangThai == "DaThanhToan")
                .GroupBy(ct => new { ct.MaMon, ct.MonAn.TenMon }) // Gom nhóm theo từng món
                .Select(g => new MonBanChayDto
                {
                    TenMon = g.Key.TenMon,
                    TongSoLuongBan = g.Sum(ct => ct.SoLuong), // Cộng dồn số lượng đĩa bán ra
                    TongDoanhThuMon = g.Sum(ct => ct.ThanhTien) // Cộng dồn số tiền mang lại
                })
                .OrderByDescending(x => x.TongSoLuongBan) // Xếp giảm dần theo số lượng bán
                .Take(top) // Lấy top N món
                .ToListAsync();
        }
    }
}