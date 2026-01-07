using Logra_API.Data;
using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Services.Implementations;

public class DayService : IDayService
{
    private readonly LograContext _context;

    public DayService(LograContext context)
    {
        _context = context;
    }

    public async Task<DayDTO> GetByIdAsync(int userId, int dayId)
    {
        var day = await _context.Days
            .FirstOrDefaultAsync(d => d.Id == dayId && d.UserId == userId);

        if (day == null)
            throw new KeyNotFoundException("Day not found.");

        return MapToDTO(day);
    }

    public async Task<DayDTO> GetOrCreateTodayAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        var day = await _context.Days
            .FirstOrDefaultAsync(d =>
                d.UserId == userId &&
                d.Date.Date == today
            );

        if (day == null)
        {
            day = new Day
            {
                UserId = userId,
                Date = today,
                CreatedDate = DateTime.UtcNow
            };

            _context.Days.Add(day);
            await _context.SaveChangesAsync();
        }

        return MapToDTO(day);
    }


    public async Task<DayDTO> UpdateAsync(int userId, int dayId, DayUpdateDTO dto)
    {
        var day = await _context.Days
            .FirstOrDefaultAsync(d => d.Id == dayId && d.UserId == userId);

        if (day == null)
            throw new KeyNotFoundException("Day not found.");

        day.Mood = dto.Mood;
        day.DailyNote = dto.DailyNote;
        day.MorningNote = dto.MorningNote;
        day.WaterIntake = dto.WaterIntake;
        day.SleepHours = dto.SleepHours;
        day.Breakfast = dto.Breakfast;
        day.Lunch = dto.Lunch;
        day.Dinner = dto.Dinner;
        day.Snack = dto.Snack;

        await _context.SaveChangesAsync();

        return MapToDTO(day);
    }

    private static DayDTO MapToDTO(Day day) =>
        new()
        {
            Id = day.Id,
            Date = day.Date,
            Mood = day.Mood,
            DailyNote = day.DailyNote,
            MorningNote = day.MorningNote,
            WaterIntake = day.WaterIntake,
            SleepHours = day.SleepHours,
            Breakfast = day.Breakfast,
            Lunch = day.Lunch,
            Dinner = day.Dinner,
            Snack = day.Snack
        };
}
