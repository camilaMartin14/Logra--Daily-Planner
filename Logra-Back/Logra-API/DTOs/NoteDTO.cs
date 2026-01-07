using System;
using System.Collections.Generic;

namespace Logra_API.DTOs;

/// <summary>
/// Data Transfer Object for retrieving note details.
/// </summary>
public class NoteDTO
{
    /// <summary>
    /// Unique identifier of the note.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Title of the note.
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Content of the note.
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Indicates if the note is archived.
    /// </summary>
    public bool IsArchived { get; set; }

    /// <summary>
    /// Date when the note was created.
    /// </summary>
    public DateTime CreatedDate { get; set; }

    /// <summary>
    /// Date when the note was last updated.
    /// </summary>
    public DateTime? UpdatedDate { get; set; }

    /// <summary>
    /// Categories assigned to this note.
    /// </summary>
    public List<CategoryDTO> Categories { get; set; } = new();
}
