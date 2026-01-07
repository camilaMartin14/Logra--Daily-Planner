using System;
using System.Collections.Generic;

namespace Logra_API.Models;

public partial class Category
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; }

    public string Color { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual User User { get; set; }

    public virtual ICollection<NoteCategory> NoteCategories { get; set; } = new List<NoteCategory>();

    public virtual ICollection<TaskCategory> TaskCategories { get; set; } = new List<TaskCategory>();
}