using Logra_API.DTOs;
using Logra_API.Models;

namespace Logra_API.Services.Interfaces;

/// <summary>
/// Interface for Note business logic operations.
/// </summary>
public interface INoteService
{
    /// <summary>
    /// Creates a new note for a user.
    /// </summary>
    Task<NoteDTO> CreateNoteAsync(int userId, NoteCreateDTO noteCreateDTO);

    /// <summary>
    /// Gets a note by ID if it belongs to the authenticated user.
    /// </summary>
    Task<NoteDTO> GetNoteByIdAsync(int userId, int noteId);

    /// <summary>
    /// Gets all active notes for a user.
    /// </summary>
    Task<List<NoteDTO>> GetActiveNotesAsync(int userId);

    /// <summary>
    /// Gets all archived notes for a user.
    /// </summary>
    Task<List<NoteDTO>> GetArchivedNotesAsync(int userId);

    /// <summary>
    /// Updates a note if it belongs to the authenticated user.
    /// </summary>
    Task<NoteDTO> UpdateNoteAsync(int userId, int noteId, NoteUpdateDTO noteUpdateDTO);

    /// <summary>
    /// Archives a note.
    /// </summary>
    Task ArchiveNoteAsync(int userId, int noteId);

    /// <summary>
    /// Unarchives a note.
    /// </summary>
    Task UnarchiveNoteAsync(int userId, int noteId);

    /// <summary>
    /// Permanently deletes a note.
    /// </summary>
    Task DeleteNoteAsync(int userId, int noteId);

    /// <summary>
    /// Adds a category to a note.
    /// </summary>
    Task AddCategoryToNoteAsync(int userId, int noteId, int categoryId);

    /// <summary>
    /// Removes a category from a note.
    /// </summary>
    Task RemoveCategoryFromNoteAsync(int userId, int noteId, int categoryId);

    /// <summary>
    /// Gets notes filtered by category.
    /// </summary>
    Task<List<NoteDTO>> GetNotesByCategoryAsync(int userId, int categoryId);
}
