using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BE.Models
{
    public class PhieuNhap
    {
        [Key]
        public string MaPN { get; set; }
        public DateTime NgayNhap { get; set; }
        public float TongTien { get; set; }
        public string NguoiNhap { get; set; } // Tên người phụ trách nhập (Admin)

        public ICollection<ChiTietPhieuNhap> DanhSachChiTiet { get; set; }
    }
}