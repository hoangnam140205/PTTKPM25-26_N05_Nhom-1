using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BE.Models
{
    public class PhieuNhap
    {
        [Key]
        public string MaPN { get; set; } // Mã phiếu nhập (Bắt buộc)
        public DateTime NgayNhap { get; set; }
        public float TongTien { get; set; }
        
        public string? NguoiNhap { get; set; } // Thêm ?
        public string? NhaCungCap { get; set; } // Thêm cột hứng dữ liệu từ FE
        public string? GhiChu { get; set; }     // Thêm cột hứng dữ liệu từ FE

        public ICollection<ChiTietPhieuNhap>? DanhSachChiTiet { get; set; } // Thêm ?
    }
}