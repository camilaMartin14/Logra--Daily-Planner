using System;
using System.Collections.Generic;

namespace Logra_API.Models;

public partial class Note
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    public bool IsArchived { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public virtual User User { get; set; }

    public virtual ICollection<NoteCategory> NoteCategories { get; set; } = new List<NoteCategory>();
}