using System;

namespace Logra_API.Models;

public partial class NoteCategory
{
    public int NoteId { get; set; }

    public int CategoryId { get; set; }

    public virtual Note Note { get; set; }

    public virtual Category Category { get; set; }
}
