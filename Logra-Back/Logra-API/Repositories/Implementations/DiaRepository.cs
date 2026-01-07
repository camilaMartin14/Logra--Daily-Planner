using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Repositories.Implementations
{
    public class DayRepository : IDayRepository
    {
        private readonly LograContext _context;

        public DayRepository(LograContext context)
        {
            _context = context;
        }

        public async Task<int> CreateDay(Day day)
        {
            _context.Days.Add(day);
            await _context.SaveChangesAsync();
            return day.Id;
        }

        public async Task<bool> UpdateDay(Day day)
        {
            _context.Days.Update(day);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Day?> GetDayById(int dayId)
        {
            return await _context.Days.FindAsync(dayId);
        }

        public async Task<Day?> GetDayByUserAndDate(int userId, DateTime date)
        {
            return await _context.Days
                .FirstOrDefaultAsync(d => d.UserId == userId && d.Date == date);
        }
    }
}
