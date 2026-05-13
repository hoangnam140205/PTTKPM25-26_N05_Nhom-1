using BE.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BE.Services
{
    public interface IAuthService
    {
        Task<string> DangNhapAsync(string maNV, string matKhau);
    }

    public class AuthService : IAuthService
    {
        private readonly RestaurantDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(RestaurantDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<string> DangNhapAsync(string maNV, string matKhau)
        {
            // 1. Tìm nhân viên trong Database
            var nhanVien = await _context.NhanViens.FirstOrDefaultAsync(nv => nv.MaNV == maNV && nv.MatKhau == matKhau);
            
            if (nhanVien == null) return null; // Sai tài khoản hoặc mật khẩu

            // 2. Xác định quyền (Role) dựa trên loại đối tượng (Admin hay ThuNgan)
            string role = nhanVien.GetType().Name; 

            // 3. Tạo các thông tin (Claims) sẽ được gói gọn vào trong Token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, nhanVien.MaNV),
                new Claim(ClaimTypes.Name, nhanVien.HoTen),
                new Claim(ClaimTypes.Role, role) // Phân quyền nằm ở đây
            };

            // 4. Lấy khóa bí mật từ appsettings.json để ký Token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 5. Cấu hình thời hạn và đóng gói Token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8), // Token sống trong 8 tiếng (1 ca làm việc)
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}