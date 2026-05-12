using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models
{
    public class HoaDon
    {
        [Key]
        public string MaHD { get; set; }
        
        public DateTime NgayTao { get; set; }
        
        public float TongTien { get; set; }
        
        public string TrangThai { get; set; } // Ví dụ: "ChuaThanhToan", "DaThanhToan"

        // --- CÁC KHÓA NGOẠI (FOREIGN KEYS) ---

        // 1. Khóa ngoại liên kết Khách Hàng (Cho phép null nếu là khách vãng lai)
        public string KhachHangSoDienThoai { get; set; }
        [ForeignKey("KhachHangSoDienThoai")]
        public KhachHang KhachHang { get; set; }

        // 2. Khóa ngoại liên kết Bàn (Cho phép null nếu là đơn giao hàng online)
        public int? MaBan { get; set; }
        [ForeignKey("MaBan")]
        public Ban Ban { get; set; }

        // 3. Khóa ngoại liên kết Thu Ngân xử lý
        public string ThuNganMaNV { get; set; }
        [ForeignKey("ThuNganMaNV")]
        public ThuNgan ThuNgan { get; set; }

        // 4. Khóa ngoại liên kết Khuyến Mãi (Cho phép null nếu không áp mã)
        public string KhuyenMaiMaKM { get; set; }
        [ForeignKey("KhuyenMaiMaKM")]
        public KhuyenMai KhuyenMai { get; set; }

        // --- QUAN HỆ THÀNH PHẦN (COMPOSITION) ---
        // 1 Hóa đơn bao gồm một danh sách các Chi tiết hóa đơn
        public ICollection<ChiTietHoaDon> DanhSachChiTiet { get; set; }
    }
}