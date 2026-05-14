using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BE.Models
{
    public class KhuyenMai
    {
        [Key]
        public string MaKM { get; set; }
        
        public float PhanTramGiam { get; set; }
        
        public DateTime HanSuDung { get; set; }
        
        // Quan hệ 1-Nhiều: 1 Khuyến mãi áp dụng cho nhiều Hóa đơn
        public ICollection<HoaDon>? HoaDons { get; set; }
    }
}