namespace Logra_API.DTOs
{
    public class DayUpdateDTO
    {
        public string? Mood { get; set; } 
        public string? DailyNote { get; set; } 
        public string? MorningNote { get; set; } 
        public int? WaterIntake { get; set; }
        public int? SleepHours { get; set; }
        public string? Breakfast { get; set; } 
        public string? Lunch { get; set; } 
        public string? Dinner { get; set; } 
        public string? Snack { get; set; } 
    }
}
