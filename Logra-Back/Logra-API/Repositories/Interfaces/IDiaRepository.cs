using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface IDayRepository
    {
        Task <int> CreateDay(Day day);
        Task <Day?> GetDayById(int dayId);
        Task <Day?> GetDayByUserAndDate(int userId, DateTime date);
        Task <bool> UpdateDay(Day day);
    }
}
