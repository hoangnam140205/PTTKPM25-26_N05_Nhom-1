using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // 1. THÊM THƯ VIỆN NÀY ĐỂ DÙNG JSON IGNORE

namespace BE.Models
{
    public class ChiTietPhieuNhap
    {
        public string? MaPN { get; set; }
        
        [JsonIgnore] // 2. THÊM CHỐT CHẶN VÀO ĐÂY
        [ForeignKey("MaPN")]
        public PhieuNhap? PhieuNhap { get; set; }

        public string MaNL { get; set; }
        
        [JsonIgnore] // 3. THÊM CHỐT CHẶN VÀO ĐÂY NỮA
        [ForeignKey("MaNL")]
        public NguyenLieu? NguyenLieu { get; set; }

        public float SoLuong { get; set; }
        public float DonGia { get; set; }
        public float ThanhTien { get; set; }
    }
}