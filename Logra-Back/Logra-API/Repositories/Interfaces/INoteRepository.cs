using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces;

/// <summary>
/// Interface for Note repository operations.
/// </summary>
public interface INoteRepository
{
    /// <summary>
    /// Creates a new note.
    /// </summary>
    Task<Note> CreateNoteAsync(Note note);

    /// <summary>
    /// Gets a note by its ID.
    /// </summary>
    Task<Note> GetNoteByIdAsync(int noteId);

    /// <summary>
    /// Gets all active (non-archived) notes for a user.
    /// </summary>
    Task<List<Note>> GetActiveNotesByUserAsync(int userId);

    /// <summary>
    /// Gets all archived notes for a user.
    /// </summary>
    Task<List<Note>> GetArchivedNotesByUserAsync(int userId);

    /// <summary>
    /// Updates an existing note.
    /// </summary>
    Task<Note> UpdateNoteAsync(Note note);

    /// <summary>
    /// Archives a note.
    /// </summary>
    Task ArchiveNoteAsync(int noteId);

    /// <summary>
    /// Unarchives a note.
    /// </summary>
    Task UnarchiveNoteAsync(int noteId);

    /// <summary>
    /// Permanently deletes a note.
    /// </summary>
    Task DeleteNoteAsync(int noteId);

    /// <summary>
    /// Adds a category to a note.
    /// </summary>
    Task AddCategoryToNoteAsync(int noteId, int categoryId);

    /// <summary>
    /// Removes a category from a note.
    /// </summary>
    Task RemoveCategoryFromNoteAsync(int noteId, int categoryId);

    /// <summary>
    /// Gets notes filtered by category.
    /// </summary>
    Task<List<Note>> GetNotesByCategoryAsync(int userId, int categoryId);
}
