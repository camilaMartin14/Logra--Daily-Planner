using System;
using System.Collections.Generic;

namespace Logra_API.Models;

public partial class TaskCategory
{
    public int TaskItemId { get; set; }

    public int CategoryId { get; set; }

    public virtual TaskItem TaskItem { get; set; }

    public virtual Category Category { get; set; }
}
