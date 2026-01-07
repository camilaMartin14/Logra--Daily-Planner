using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs;

/// <summary>
/// Data Transfer Object for updating an existing note.
/// </summary>
public class NoteUpdateDTO
{
    /// <summary>
    /// Title of the note.
    /// </summary>
    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Content of the note.
    /// </summary>
    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;
}
