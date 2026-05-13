using BE.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BE.Controllers
{
    public class LoginRequest
    {
        public string MaNV { get; set; }
        public string MatKhau { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("dang-nhap")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.DangNhapAsync(request.MaNV, request.MatKhau);

            if (token == null)
            {
                return Unauthorized(new { message = "Mã nhân viên hoặc mật khẩu không chính xác." });
            }

            return Ok(new { 
                message = "Đăng nhập thành công", 
                token = token 
            });
        }
    }
}