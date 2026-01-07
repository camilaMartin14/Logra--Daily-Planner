using Logra_API.DTOs;
using Logra_API.Models;

namespace Logra_API.Services.Interfaces
{
    public interface IDayService
    {
        Task<bool> UpdateDayAsync(int dayId, DayUpdateDTO dto);
        Task<DayDTO?> GetDayByIdAsync(int dayId);
        Task<DayDTO> GetOrCreateDayAsync(int userId); // Always retrieves or creates today's day
    }
}
