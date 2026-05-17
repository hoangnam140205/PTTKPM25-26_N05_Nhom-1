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
        Task<NguyenLieu> CapNhatNguyenLieuAsync(string maNL, NguyenLieu nl);
        Task<bool> XoaNguyenLieuAsync(string maNL);
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

        public async Task<NguyenLieu> CapNhatNguyenLieuAsync(string maNL, NguyenLieu nl)
        {
            var existing = await _context.NguyenLieus.FindAsync(maNL);
            if (existing == null) return null;

            existing.TenNL = nl.TenNL;
            existing.DonViTinh = nl.DonViTinh;
            existing.DonGia = nl.DonGia;
            existing.SoLuongTon = nl.SoLuongTon;
            existing.GiaTriTon = nl.GiaTriTon;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> XoaNguyenLieuAsync(string maNL)
        {
            var existing = await _context.NguyenLieus.FindAsync(maNL);
            if (existing == null) return false;

            try 
            {
                _context.NguyenLieus.Remove(existing);
                await _context.SaveChangesAsync();
                return true;
            } 
            catch 
            {
                return false; // Could fail if there are foreign key constraints from PhieuNhap
            }
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
                    nguyenLieu.GiaTriTon += ct.ThanhTien;
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