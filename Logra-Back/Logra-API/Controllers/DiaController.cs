using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DayController : ControllerBase
    {
        private readonly IDayService _service;
        private readonly LograContext _context;

        public DayController(IDayService service, LograContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateDay([FromBody] DayDTO dto)
        {
            if (dto.Date == default)
                return BadRequest("Date required");

            // Get UserId from token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier"));
            if (userIdClaim == null)
                return Unauthorized();

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            // Verify user exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                return BadRequest("User not found");

            var day = new Day { Date = dto.Date, UserId = userId };
            _context.Days.Add(day);
            await _context.SaveChangesAsync();

            return Ok(new { id = day.Id });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var day = await _service.GetDayByIdAsync(id);
            if (day == null)
                return NotFound();

            return Ok(day);
        }

        [Authorize]
        [HttpGet("date/{date}")]
        public async Task<IActionResult> GetOrCreateByDate(DateTime date)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier"));
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            // Search for existing day
            var existingDay = await _context.Days
                .FirstOrDefaultAsync(d => d.UserId == userId && d.Date == date);

            if (existingDay != null)
                return Ok(existingDay);

            // Create new day
            var newDay = new Day
            {
                UserId = userId,
                Date = date,
                WaterIntake = 0,
                SleepHours = 0,
                Mood = null,
                DailyNote = null,
                MorningNote = null,
                Breakfast = null,
                Lunch = null,
                Dinner = null,
                Snack = null
            };

            _context.Days.Add(newDay);
            await _context.SaveChangesAsync();

            return Ok(newDay);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DayUpdateDTO dto)
        {
            var ok = await _service.UpdateDayAsync(id, dto);
            if (!ok)
                return NotFound();

            return NoContent();
        }
    }
}
