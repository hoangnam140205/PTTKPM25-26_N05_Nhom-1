using BE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BE.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin/[controller]")]
    [ApiController]
    public class BaoCaoController : ControllerBase
    {
        private readonly IBaoCaoService _baoCaoService;

        public BaoCaoController(IBaoCaoService baoCaoService)
        {
            _baoCaoService = baoCaoService;
        }

        // API: GET /api/admin/baocao/doanh-thu-hom-nay
        [HttpGet("doanh-thu-hom-nay")]
        public async Task<IActionResult> GetDoanhThuHomNay()
        {
            var doanhThu = await _baoCaoService.TinhDoanhThuHomNayAsync();
            return Ok(new { Ngay = DateTime.Today, TongDoanhThu = doanhThu });
        }

        // API: GET /api/admin/baocao/thong-ke-doanh-thu?tuNgay=2026-05-01&denNgay=2026-05-12
        [HttpGet("thong-ke-doanh-thu")]
        public async Task<IActionResult> GetThongKeDoanhThu([FromQuery] DateTime tuNgay, [FromQuery] DateTime denNgay)
        {
            if (tuNgay > denNgay) 
                return BadRequest("Ngày bắt đầu không thể lớn hơn ngày kết thúc.");
            
            var data = await _baoCaoService.ThongKeDoanhThuAsync(tuNgay, denNgay);
            return Ok(data);
        }

        // API: GET /api/admin/baocao/top-mon-ban-chay?tuNgay=2026-05-01&denNgay=2026-05-12&top=5
        [HttpGet("top-mon-ban-chay")]
        public async Task<IActionResult> GetTopMonBanChay([FromQuery] DateTime tuNgay, [FromQuery] DateTime denNgay, [FromQuery] int top = 5)
        {
            if (tuNgay > denNgay) 
                return BadRequest("Ngày bắt đầu không thể lớn hơn ngày kết thúc.");

            var data = await _baoCaoService.TopMonBanChayAsync(tuNgay, denNgay, top);
            return Ok(data);
        }
    }
}