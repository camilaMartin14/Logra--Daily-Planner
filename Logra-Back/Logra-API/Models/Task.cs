using System;
using System.Collections.Generic;

namespace Logra_API.Models;

public partial class TaskItem
{
    public int Id { get; set; }

    public int DayId { get; set; }

    public string Description { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime CreatedDate { get; set; }
    public virtual Day Day { get; set; }

    public virtual ICollection<TaskCategory> TaskCategories { get; set; } = new List<TaskCategory>();
}