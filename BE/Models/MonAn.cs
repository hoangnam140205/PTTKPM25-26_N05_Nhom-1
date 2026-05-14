using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BE.Models
{
    public class MonAn
    {
        [Key]
        public string MaMon { get; set; }
        
        public string TenMon { get; set; }
        
        public float GiaTien { get; set; }
        
        public string TrangThai { get; set; }

        public string? HinhAnh { get; set; }

        // Quan hệ 1-Nhiều với ChiTietHoaDon
        public virtual ICollection<ChiTietHoaDon>? ChiTietHoaDons { get; set; }
    }
}