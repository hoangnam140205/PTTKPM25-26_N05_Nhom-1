using BE.Models;
using BE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BE.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class BanController : ControllerBase
    {
        private readonly IBanService _banService;

        public BanController(IBanService banService)
        {
            _banService = banService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var bans = await _banService.LayDanhSachAsync();
            return Ok(bans);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ban = await _banService.LayThongTinAsync(id);
            if (ban == null) return NotFound();
            return Ok(ban);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Ban ban)
        {
            var createdBan = await _banService.ThemAsync(ban);
            return CreatedAtAction(nameof(GetById), new { id = createdBan.MaBan }, createdBan);
        }

        [Authorize(Roles = "Admin")]
        // API Chuyển bàn: PUT api/admin/ban/chuyen/1/sang/2
        [HttpPut("chuyen/{maBanCu}/sang/{maBanMoi}")]
        public async Task<IActionResult> ChuyenBan(int maBanCu, int maBanMoi)
        {
            var result = await _banService.ChuyenBanAsync(maBanCu, maBanMoi);
            if (!result) return BadRequest("Không thể chuyển bàn. Vui lòng kiểm tra trạng thái bàn đích hoặc hóa đơn.");
            return Ok("Chuyển bàn thành công.");
        }

        [Authorize(Roles = "Admin")]
        // API Gộp bàn: PUT api/admin/ban/gop/1/vao/2
        [HttpPut("gop/{maBanNguon}/vao/{maBanDich}")]
        public async Task<IActionResult> GopBan(int maBanNguon, int maBanDich)
        {
            var result = await _banService.GopBanAsync(maBanNguon, maBanDich);
            if (!result) return BadRequest("Không thể gộp bàn. Kiểm tra lại hóa đơn ở cả 2 bàn.");
            return Ok("Gộp bàn thành công.");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _banService.XoaAsync(id);
            if (!result) return NotFound();
            return Ok("Xóa bàn thành công.");
        }
    }
}