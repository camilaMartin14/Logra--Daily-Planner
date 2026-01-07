using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs;

public class NoteUpdateDTO
{
    [Required]
    [MaxLength(255)]
    public string? Title { get; set; } 

    [Required]
    [MaxLength(5000)]
    public string? Content { get; set; } 
}
