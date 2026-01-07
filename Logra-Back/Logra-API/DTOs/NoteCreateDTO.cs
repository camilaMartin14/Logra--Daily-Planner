using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs;

/// <summary>
/// Data Transfer Object for creating a new note.
/// </summary>
public class NoteCreateDTO
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
