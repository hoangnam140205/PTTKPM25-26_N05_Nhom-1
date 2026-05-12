using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BE.Models
{
    public class Ban
    {
        [Key]
        public int MaBan { get; set; }
        
        public string TrangThai { get; set; } // Ví dụ: "Trong", "CoKhach", "DaDat"
        
        // Quan hệ 1-Nhiều: 1 Bàn có thể có nhiều Hóa đơn theo thời gian
        public ICollection<HoaDon> HoaDons { get; set; }
    }
}