namespace BE.Models
{
    // Kế thừa toàn bộ thuộc tính từ NhanVien
    public class Admin : NhanVien 
    {
        // Entity Framework Core sẽ gộp chung vào bảng NhanVien 
        // và tự phân biệt Admin bằng cột Discriminator
    }
}