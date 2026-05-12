using BE.Models;
using BE.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BE.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class MonAnController : ControllerBase
    {
        private readonly IMonAnService _monAnService;

        public MonAnController(IMonAnService monAnService)
        {
            _monAnService = monAnService;
        }

        // GET: api/admin/MonAn (Xem thực đơn)
        [HttpGet]
        public async Task<IActionResult> GetDanhSachMonAn()
        {
            var danhSach = await _monAnService.LấyDanhSachMonAnAsync();
            return Ok(danhSach);
        }

        // POST: api/admin/MonAn (Thêm món mới)
        [HttpPost]
        public async Task<IActionResult> ThemMonAn([FromBody] MonAn monAn)
        {
            var ketQua = await _monAnService.ThêmMonAnAsync(monAn);
            return CreatedAtAction(nameof(GetDanhSachMonAn), new { id = ketQua.MaMon }, ketQua);
        }

        // PUT: api/admin/MonAn/{id} (Sửa thông tin món)
        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhatMonAn(string id, [FromBody] MonAn monAn)
        {
            var thanhCong = await _monAnService.CậpNhatMonAnAsync(id, monAn);
            if (!thanhCong) return NotFound("Không tìm thấy món ăn này!");
            
            return Ok("Cập nhật thành công!");
        }

        // DELETE: api/admin/MonAn/{id} (Xóa món)
        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaMonAn(string id)
        {
            var thanhCong = await _monAnService.XóaMonAnAsync(id);
            if (!thanhCong) return NotFound("Không tìm thấy món ăn này!");
            
            return Ok("Xóa thành công!");
        }
    }
}