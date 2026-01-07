using System;
using System.Collections.Generic;

namespace Logra_API.Models;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; }

    public string PasswordHash { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public DateTime RegistrationDate { get; set; }

    public virtual ICollection<Day> Days { get; set; } = new List<Day>();

    public virtual ICollection<Note> Notes { get; set; } = new List<Note>();

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
}