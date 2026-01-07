using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Logra_API.Services.Interfaces;
using Logra_API.Security;

namespace Logra_API.Services.Implementations
{
    public class DayService : IDayService
    {
        private readonly IDayRepository _repo;
        private readonly EncryptionService _encryption;

        public DayService(IDayRepository repo, EncryptionService encryption)
        {
            _repo = repo;
            _encryption = encryption;
        }

        public async Task<bool> UpdateDayAsync(int dayId, DayUpdateDTO dto)
        {
            var day = await _repo.GetDayById(dayId);
            if (day == null) return false;

            day.WaterIntake = dto.WaterIntake;
            day.SleepHours = dto.SleepHours;
            day.Mood = dto.Mood;
            day.DailyNote = _encryption.Encrypt(dto.DailyNote);
            day.MorningNote = _encryption.Encrypt(dto.MorningNote);
            day.Breakfast = dto.Breakfast;
            day.Lunch = dto.Lunch;
            day.Dinner = dto.Dinner;
            day.Snack = dto.Snack;

            return await _repo.UpdateDay(day);
        }

        public async Task<DayDTO?> GetDayByIdAsync(int dayId)
        {
            var day = await _repo.GetDayById(dayId);
            if (day == null) return null;

            return MapToDTO(day);
        }

        public async Task<DayDTO> GetOrCreateDayAsync(int userId)
        {
            var today = DateTime.Today;

            var day = await _repo.GetDayByUserAndDate(userId, today);
            if (day == null)
            {
                day = CreateDefaultDay(userId, today);
                day.Id = await _repo.CreateDay(day);
            }

            return MapToDTO(day);
        }

        private Day CreateDefaultDay(int userId, DateTime date)
        {
            return new Day
            {
                UserId = userId,
                Date = date,
                Mood = "",
                DailyNote = "",
                MorningNote = "",
                WaterIntake = 0,
                SleepHours = 0,
                Breakfast = "",
                Lunch = "",
                Dinner = "",
                Snack = ""
            };
        }

        private DayDTO MapToDTO(Day day) => new DayDTO
        {
            Id = day.Id,
            Date = day.Date,
            Mood = day.Mood,
            DailyNote = _encryption.Decrypt(day.DailyNote),
            MorningNote = _encryption.Decrypt(day.MorningNote),
            WaterIntake = day.WaterIntake,
            SleepHours = day.SleepHours,
            Breakfast = day.Breakfast,
            Lunch = day.Lunch,
            Dinner = day.Dinner,
            Snack = day.Snack
        };
    }
}
