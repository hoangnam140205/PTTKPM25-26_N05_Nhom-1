using System.Collections.Generic;

namespace BE.Models
{
    // Kế thừa từ NhanVien
    public class ThuNgan : NhanVien 
    {
        // Thu ngân sẽ xử lý nhiều Hóa Đơn
        public ICollection<HoaDon> HoaDonsDaXuLy { get; set; }
    }
}