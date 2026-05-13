using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models
{
    public class ChiTietPhieuNhap
    {
        public string MaPN { get; set; }
        [ForeignKey("MaPN")]
        public PhieuNhap PhieuNhap { get; set; }

        public string MaNL { get; set; }
        [ForeignKey("MaNL")]
        public NguyenLieu NguyenLieu { get; set; }

        public float SoLuong { get; set; }
        public float DonGia { get; set; }
        public float ThanhTien { get; set; }
    }
}