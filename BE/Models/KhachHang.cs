using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BE.Models
{
    public class KhachHang
    {
        [Key]
        public string SoDienThoai { get; set; } // Dùng SĐT làm Khóa chính
        
        public string HoTen { get; set; }
        
        public string DiaChi { get; set; }
        
        // Quan hệ 1-Nhiều: Khách hàng có thể đặt nhiều Hóa đơn
        public ICollection<HoaDon> HoaDons { get; set; }
    }
}