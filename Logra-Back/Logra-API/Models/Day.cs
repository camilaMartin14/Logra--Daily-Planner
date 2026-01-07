using System;
using System.Collections.Generic;

namespace Logra_API.Models;

public partial class Day
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime Date { get; set; }

    public string? Mood { get; set; }

    public string? DailyNote { get; set; }

    public string MorningNote { get; set; }

    public int WaterIntake { get; set; }

    public int? SleepHours { get; set; }

    public string Breakfast { get; set; }

    public string Lunch { get; set; }

    public string Dinner { get; set; }

    public string Snack { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

    public virtual User User { get; set; }
}