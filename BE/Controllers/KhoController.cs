using BE.Models;
using BE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BE.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin/[controller]")]
    [ApiController]
    public class KhoController : ControllerBase
    {
        private readonly IKhoService _khoService;

        public KhoController(IKhoService khoService)
        {
            _khoService = khoService;
        }

        // Xem danh sách nguyên liệu và số lượng tồn
        [HttpGet("ton-kho")]
        public async Task<IActionResult> GetTonKho()
        {
            var data = await _khoService.XemTonKhoAsync();
            return Ok(data);
        }

        // Định nghĩa 1 nguyên liệu mới (Ví dụ: Thêm "Thịt Bò" vào danh mục kho)
        [HttpPost("nguyen-lieu")]
        public async Task<IActionResult> ThemNguyenLieu(NguyenLieu nl)
        {
            var created = await _khoService.ThemNguyenLieuMoiAsync(nl);
            return Ok(created);
        }

        // Lưu Phiếu Nhập Kho (Tự động cộng dồn số lượng tồn)
        [HttpPost("nhap-kho")]
        public async Task<IActionResult> TaoPhieuNhap(PhieuNhap phieuNhap)
        {
            var ketQua = await _khoService.NhapKhoAsync(phieuNhap);
            return Ok(new { 
                Message = "Nhập kho thành công, số lượng tồn đã được cập nhật.", 
                Data = ketQua 
            });
        }
    }
}