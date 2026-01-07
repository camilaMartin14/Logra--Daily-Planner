using Logra_API.DTOs;

namespace Logra_API.Services.Interfaces;

public interface IDayService
{
    Task<DayDTO> GetByIdAsync(int userId, int dayId);

    Task<DayDTO> GetOrCreateTodayAsync(int userId);

    Task<DayDTO> UpdateAsync(int userId, int dayId, DayUpdateDTO dto);
}
