using BE.Models;
using BE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BE.Controllers
{
    // Tạo 1 Data Transfer Object (DTO) nhỏ để nhận dữ liệu từ Frontend cho tính năng Đổi món
    public class DoiMonRequest
    {
        public string MaMonMoi { get; set; }
        public int SoLuongMoi { get; set; }
    }

    // Tạo 1 Data Transfer Object (DTO) nhỏ để nhận dữ liệu từ Frontend cho tính năng Thanh toán
    public class ThanhToanRequest
    {
        public string? MaKM { get; set; } // Khuyến mãi là tùy chọn
    }

    [Authorize(Roles = "Admin,ThuNgan")]
    [Route("api/admin/[controller]")]
    [ApiController]
    public class HoaDonController : ControllerBase
    {
        private readonly IHoaDonService _hoaDonService;

        public HoaDonController(IHoaDonService hoaDonService)
        {
            _hoaDonService = hoaDonService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var hoaDons = await _hoaDonService.LayDanhSachAsync();
            return Ok(hoaDons);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var hoaDon = await _hoaDonService.LayThongTinAsync(id);
            if (hoaDon == null) return NotFound("Không tìm thấy hóa đơn này.");
            return Ok(hoaDon);
        }

        // --- CÁC API NGHIỆP VỤ PHỨC TẠP ---

        [Authorize(Roles = "Admin")]
        // API Hủy món: DELETE api/admin/hoadon/HD01/mon/M02
        [HttpDelete("{maHD}/mon/{maMon}")]
        public async Task<IActionResult> HuyMon(string maHD, string maMon)
        {
            var result = await _hoaDonService.HuyMonAsync(maHD, maMon);
            if (!result) return NotFound("Không tìm thấy hóa đơn hoặc món ăn này để hủy.");

            return Ok(new { message = "Hủy món thành công, đã cập nhật tổng tiền." });
        }

        // API Đổi món: PUT api/admin/hoadon/HD01/mon/M02
        [Authorize(Roles = "Admin")]
        [HttpPut("{maHD}/mon/{maMonCu}")]
        public async Task<IActionResult> DoiMon(string maHD, string maMonCu, [FromBody] DoiMonRequest request)
        {
            var result = await _hoaDonService.DoiMonAsync(maHD, maMonCu, request.MaMonMoi, request.SoLuongMoi);
            if (!result) return BadRequest("Lỗi khi đổi món. Vui lòng kiểm tra lại mã món mới.");

            return Ok(new { message = "Đổi món thành công, đã cập nhật tổng tiền." });
        }

        // API Thanh toán: PUT api/admin/hoadon/HD01/thanh-toan
        [Authorize(Roles = "Admin,ThuNgan")] // Cho phép cả Thu ngân truy cập
        [HttpPut("{maHD}/thanh-toan")]
        public async Task<IActionResult> ThanhToan(string maHD, [FromBody] ThanhToanRequest request)
        {
            try
            {
                var hoaDonDaThanhToan = await _hoaDonService.ThanhToanAsync(maHD, request?.MaKM);
                
                if (hoaDonDaThanhToan == null) 
                    return BadRequest("Không tìm thấy hóa đơn hoặc hóa đơn này đã được thanh toán.");

                return Ok(new { 
                    message = "Thanh toán thành công!", 
                    data = hoaDonDaThanhToan 
                });
            }
            catch (Exception ex)
            {
                // Bắt lỗi mã khuyến mãi sai/hết hạn ném ra từ Service
                return BadRequest(ex.Message); 
            }
        }
    }
}