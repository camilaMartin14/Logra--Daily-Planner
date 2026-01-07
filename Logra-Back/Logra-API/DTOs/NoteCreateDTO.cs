using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs;

public class NoteCreateDTO
{
    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string? Content { get; set; } = string.Empty;
}
