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
        // Quan hệ 1-Nhiều với ChiTietHoaDon
        public ICollection<ChiTietHoaDon> ChiTietHoaDons { get; set; }
    }
}