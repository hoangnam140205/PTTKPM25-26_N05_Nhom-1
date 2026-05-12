using BE.Data;
using BE.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BE.Services
{
    public interface IMonAnService
    {
        Task<List<MonAn>> LấyDanhSachMonAnAsync();
        Task<MonAn> ThêmMonAnAsync(MonAn monAn);
        Task<bool> CậpNhatMonAnAsync(string id, MonAn monAn);
        Task<bool> XóaMonAnAsync(string id);
    }

    public class MonAnService : IMonAnService
    {
        private readonly RestaurantDbContext _context;

        public MonAnService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<List<MonAn>> LấyDanhSachMonAnAsync()
        {
            return await _context.MonAns.ToListAsync();
        }

        public async Task<MonAn> ThêmMonAnAsync(MonAn monAn)
        {
            _context.MonAns.Add(monAn);
            await _context.SaveChangesAsync();
            return monAn;
        }

        public async Task<bool> CậpNhatMonAnAsync(string id, MonAn monAn)
        {
            var monAnCu = await _context.MonAns.FindAsync(id);
            if (monAnCu == null) return false;

            monAnCu.TenMon = monAn.TenMon;
            monAnCu.GiaTien = monAn.GiaTien;
            monAnCu.TrangThai = monAn.TrangThai;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> XóaMonAnAsync(string id)
        {
            var monAn = await _context.MonAns.FindAsync(id);
            if (monAn == null) return false;

            _context.MonAns.Remove(monAn);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}