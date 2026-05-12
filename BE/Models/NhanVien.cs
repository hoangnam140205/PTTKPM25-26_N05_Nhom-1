using System.ComponentModel.DataAnnotations;

namespace BE.Models
{
    public class NhanVien
    {
        [Key]
        public string MaNV { get; set; }
        
        public string HoTen { get; set; }
        
        public string MatKhau { get; set; }
    }
}