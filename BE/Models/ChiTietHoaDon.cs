using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models
{
    public class ChiTietHoaDon
    {
        // Lưu ý: Không dùng [Key] ở đây vì chúng ta sẽ cấu hình Khóa chính kép 
        // (Composite Key gồm MaHD và MaMon) bên trong file DbContext.

        public string MaHD { get; set; }
        [ForeignKey("MaHD")]
        public HoaDon HoaDon { get; set; }

        public string MaMon { get; set; }
        [ForeignKey("MaMon")]
        public MonAn MonAn { get; set; }

        public int SoLuong { get; set; }
        
        public float ThanhTien { get; set; }
        
        public string GhiChu { get; set; } // Ví dụ: "Ít cay, không đá..."
    }
}