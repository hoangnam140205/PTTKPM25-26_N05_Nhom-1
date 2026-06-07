using BE.Models;
using BE.Services;
using BE.Data; // Thêm thư viện này để gọi được RestaurantDbContext
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BE.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class MonAnController : ControllerBase
    {
        private readonly IMonAnService _monAnService;
        private readonly RestaurantDbContext _context; // Khai báo thêm _context

        // Tiêm cả Service và DbContext vào constructor
        public MonAnController(IMonAnService monAnService, RestaurantDbContext context)
        {
            _monAnService = monAnService;
            _context = context; 
        }

        // GET: api/admin/MonAn (Xem thực đơn)
        [HttpGet]
        public async Task<IActionResult> GetDanhSachMonAn()
        {
            var danhSach = await _monAnService.LấyDanhSachMonAnAsync();
            return Ok(danhSach);
        }

        // POST: api/admin/MonAn (Thêm món mới)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> ThemMonAn([FromBody] MonAn monAn)
        {
            var ketQua = await _monAnService.ThêmMonAnAsync(monAn);
            return CreatedAtAction(nameof(GetDanhSachMonAn), new { id = ketQua.MaMon }, ketQua);
        }

        // PUT: api/admin/MonAn/{id} (Sửa thông tin món)
        [Authorize(Roles = "Admin,Bep")]
        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhatMonAn(string id, [FromBody] MonAn monAn)
        {
            var thanhCong = await _monAnService.CậpNhatMonAnAsync(id, monAn);
            if (!thanhCong) return NotFound("Không tìm thấy món ăn này!");

            return Ok("Cập nhật thành công!");
        }

        // DELETE: api/admin/MonAn/{id} (Xóa món)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaMonAn(string id)
        {
            var thanhCong = await _monAnService.XóaMonAnAsync(id);
            if (!thanhCong) return NotFound("Không tìm thấy món ăn này!");

            return Ok("Xóa thành công!");
        }

        // PUT: api/admin/MonAn/{maMon}/doi-trang-thai (Đổi trạng thái Còn hàng/Hết hàng)
        [HttpPut("{maMon}/doi-trang-thai")]
        public async Task<IActionResult> DoiTrangThaiMonAn(string maMon)
        {
            // Sử dụng _context để tìm kiếm và lưu thay đổi trực tiếp
            var monAn = await _context.MonAns.FindAsync(maMon);
            if (monAn == null) return NotFound("Không tìm thấy món ăn.");

            // Đảo ngược trạng thái
            monAn.TrangThai = monAn.TrangThai == "Còn hàng" ? "Hết hàng" : "Còn hàng";

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật trạng thái thành công!", data = monAn });
        }
    }
}