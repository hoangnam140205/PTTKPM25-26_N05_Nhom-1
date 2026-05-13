using BE.Data;
using BE.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq; // Cần dùng cho LINQ
using System.Threading.Tasks;

namespace BE.Services
{
    public interface IKhuyenMaiService
    {
        Task<List<KhuyenMai>> LayDanhSachAsync();
        Task<List<KhuyenMai>> LayDanhSachHopLeAsync(); // Tối ưu: Lấy danh sách còn hạn
        Task<KhuyenMai> ThemAsync(KhuyenMai khuyenMai);
        Task<KhuyenMai> LayThongTinAsync(string id); 
        Task<bool> CapNhatAsync(string id, KhuyenMai khuyenMai); 
        Task<bool> XoaAsync(string id); 
    }

    public class KhuyenMaiService : IKhuyenMaiService
    {
        private readonly RestaurantDbContext _context;

        public KhuyenMaiService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<List<KhuyenMai>> LayDanhSachAsync()
        {
            return await _context.KhuyenMais.ToListAsync();
        }

        // Tối ưu: Chỉ lấy các mã có hạn sử dụng lớn hơn thời điểm hiện tại
        public async Task<List<KhuyenMai>> LayDanhSachHopLeAsync()
        {
            return await _context.KhuyenMais
                                 .Where(km => km.HanSuDung > DateTime.Now)
                                 .ToListAsync();
        }

        public async Task<KhuyenMai> ThemAsync(KhuyenMai khuyenMai)
        {
            // Tối ưu: Ép mã KM luôn in hoa để dễ quản lý (vd: giam20 -> GIAM20)
            khuyenMai.MaKM = khuyenMai.MaKM.ToUpper();

            _context.KhuyenMais.Add(khuyenMai);
            await _context.SaveChangesAsync();
            return khuyenMai;
        }

        public async Task<KhuyenMai> LayThongTinAsync(string id)
        {
            return await _context.KhuyenMais.FindAsync(id);
        }

        public async Task<bool> CapNhatAsync(string id, KhuyenMai khuyenMai)
        {
            var khuyenMaiCu = await _context.KhuyenMais.FindAsync(id);
            if (khuyenMaiCu == null) return false;

            // Không cho phép sửa MaKM (vì là khóa chính), chỉ sửa thông tin
            khuyenMaiCu.PhanTramGiam = khuyenMai.PhanTramGiam;
            khuyenMaiCu.HanSuDung = khuyenMai.HanSuDung;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> XoaAsync(string id)
        {
            var khuyenMai = await _context.KhuyenMais.FindAsync(id);
            if (khuyenMai == null) return false;

            _context.KhuyenMais.Remove(khuyenMai);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}