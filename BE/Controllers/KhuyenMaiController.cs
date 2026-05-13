using BE.Models;
using BE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BE.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class KhuyenMaiController : ControllerBase
    {
        private readonly IKhuyenMaiService _khuyenMaiService;

        public KhuyenMaiController(IKhuyenMaiService khuyenMaiService)
        {
            _khuyenMaiService = khuyenMaiService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var khuyenMais = await _khuyenMaiService.LayDanhSachAsync();
            return Ok(khuyenMais);
        }

        // Tối ưu: Mở API riêng để lấy các mã KM còn hạn (Dùng cho Thu ngân)
        [HttpGet("hople")]
        public async Task<IActionResult> GetValidPromotions()
        {
            var khuyenMais = await _khuyenMaiService.LayDanhSachHopLeAsync();
            return Ok(khuyenMais);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id) // Sửa int thành string
        {
            var khuyenMai = await _khuyenMaiService.LayThongTinAsync(id);
            if (khuyenMai == null) return NotFound("Không tìm thấy khuyến mãi này.");
            return Ok(khuyenMai);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(KhuyenMai khuyenMai)
        {
            var createdKhuyenMai = await _khuyenMaiService.ThemAsync(khuyenMai);
            // Sửa lại cho đúng tên biến MaKM
            return CreatedAtAction(nameof(GetById), new { id = createdKhuyenMai.MaKM }, createdKhuyenMai);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, KhuyenMai khuyenMai) // Sửa int thành string
        {
            // Ép id trên URL thành in hoa để so sánh chính xác với MaKM
            if (id.ToUpper() != khuyenMai.MaKM.ToUpper()) return BadRequest("ID không trùng khớp.");

            var result = await _khuyenMaiService.CapNhatAsync(id, khuyenMai);
            if (!result) return NotFound("Không tìm thấy khuyến mãi để cập nhật.");
            
            return Ok("Cập nhật thành công!");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id) // Sửa int thành string
        {
            var result = await _khuyenMaiService.XoaAsync(id);
            if (!result) return NotFound("Không tìm thấy khuyến mãi để xóa.");

            return Ok("Xóa thành công!");
        }
    }
}