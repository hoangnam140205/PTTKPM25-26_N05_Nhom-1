using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BE.Models
{
    public class NguyenLieu
    {
        [Key]
        public string MaNL { get; set; }
        public string TenNL { get; set; }
        public float SoLuongTon { get; set; } // Số lượng đang có trong kho
        public string DonViTinh { get; set; } // Kg, Lít, Hộp, Chai...
        public float DonGia { get; set; }
        public float GiaTriTon { get; set; }

        public ICollection<ChiTietPhieuNhap>? ChiTietPhieuNhaps { get; set; }
    }
}