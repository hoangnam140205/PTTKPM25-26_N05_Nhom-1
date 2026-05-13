using BE.Data;
using BE.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BE.Services
{
    public interface IKhoService
    {
        Task<List<NguyenLieu>> XemTonKhoAsync();
        Task<NguyenLieu> ThemNguyenLieuMoiAsync(NguyenLieu nl);
        Task<PhieuNhap> NhapKhoAsync(PhieuNhap phieuNhap);
    }

    public class KhoService : IKhoService
    {
        private readonly RestaurantDbContext _context;

        public KhoService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<List<NguyenLieu>> XemTonKhoAsync()
        {
            return await _context.NguyenLieus.ToListAsync();
        }

        public async Task<NguyenLieu> ThemNguyenLieuMoiAsync(NguyenLieu nl)
        {
            _context.NguyenLieus.Add(nl);
            await _context.SaveChangesAsync();
            return nl;
        }

        // --- NGHIỆP VỤ LÕI: NHẬP KHO ---
        public async Task<PhieuNhap> NhapKhoAsync(PhieuNhap phieuNhap)
        {
            phieuNhap.NgayNhap = DateTime.Now;
            float tongTienPhieu = 0;

            // Xử lý từng dòng chi tiết nhập
            foreach (var ct in phieuNhap.DanhSachChiTiet)
            {
                // 1. Tính thành tiền của từng dòng (Số lượng * Đơn giá)
                ct.ThanhTien = ct.SoLuong * ct.DonGia;
                tongTienPhieu += ct.ThanhTien;

                // 2. Cập nhật Số lượng tồn kho cho nguyên liệu đó
                var nguyenLieu = await _context.NguyenLieus.FindAsync(ct.MaNL);
                if (nguyenLieu != null)
                {
                    nguyenLieu.SoLuongTon += ct.SoLuong;
                }
            }

            // Gán tổng tiền cho toàn bộ Phiếu nhập
            phieuNhap.TongTien = tongTienPhieu;

            // Lưu Phiếu Nhập và Chi Tiết (EF Core sẽ tự động lưu cả hai)
            _context.PhieuNhaps.Add(phieuNhap);
            await _context.SaveChangesAsync();

            return phieuNhap;
        }
    }
}