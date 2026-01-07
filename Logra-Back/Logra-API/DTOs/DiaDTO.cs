namespace Logra_API.DTOs
{
    public class DayDTO
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }

        public string? Mood { get; set; } = string.Empty;

        public string? DailyNote { get; set; } = string.Empty;

        public string? MorningNote { get; set; } = string.Empty;

        public int? WaterIntake { get; set; }

        public int? SleepHours { get; set; }

        public string? Breakfast { get; set; } = string.Empty;

        public string? Lunch { get; set; } = string.Empty;

        public string? Dinner { get; set; } = string.Empty;

        public string? Snack { get; set; } = string.Empty;
    }
}
