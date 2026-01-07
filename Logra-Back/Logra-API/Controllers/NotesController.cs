using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Logra_API.DTOs;
using Logra_API.Services.Interfaces;

namespace Logra_API.Controllers;

/// <summary>
/// API controller for managing user notes.
/// </summary>
[ApiController]
[Route("api/notes")]
[Authorize]
public class NotesController : ControllerBase
{
    private readonly INoteService _noteService;

    public NotesController(INoteService noteService)
    {
        _noteService = noteService;
    }

    /// <summary>
    /// Gets the current authenticated user ID from the JWT token.
    /// </summary>
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim?.Value, out var userId))
            throw new UnauthorizedAccessException("Invalid user ID in token");
        return userId;
    }

    /// <summary>
    /// Creates a new note for the authenticated user.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<NoteDTO>> CreateNote([FromBody] NoteCreateDTO noteCreateDTO)
    {
        var userId = GetUserId();
        var noteDTO = await _noteService.CreateNoteAsync(userId, noteCreateDTO);
        return CreatedAtAction(nameof(GetNoteById), new { id = noteDTO.Id }, noteDTO);
    }

    /// <summary>
    /// Gets a specific note by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<NoteDTO>> GetNoteById(int id)
    {
        var userId = GetUserId();
        var noteDTO = await _noteService.GetNoteByIdAsync(userId, id);
        return Ok(noteDTO);
    }

    /// <summary>
    /// Gets all active (non-archived) notes for the authenticated user.
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<List<NoteDTO>>> GetActiveNotes()
    {
        var userId = GetUserId();
        var notes = await _noteService.GetActiveNotesAsync(userId);
        return Ok(notes);
    }

    /// <summary>
    /// Gets all archived notes for the authenticated user.
    /// </summary>
    [HttpGet("archived")]
    public async Task<ActionResult<List<NoteDTO>>> GetArchivedNotes()
    {
        var userId = GetUserId();
        var notes = await _noteService.GetArchivedNotesAsync(userId);
        return Ok(notes);
    }

    /// <summary>
    /// Updates an existing note.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<NoteDTO>> UpdateNote(int id, [FromBody] NoteUpdateDTO noteUpdateDTO)
    {
        var userId = GetUserId();
        var noteDTO = await _noteService.UpdateNoteAsync(userId, id, noteUpdateDTO);
        return Ok(noteDTO);
    }

    /// <summary>
    /// Archives a note (soft delete).
    /// </summary>
    [HttpPut("{id}/archive")]
    public async Task<IActionResult> ArchiveNote(int id)
    {
        var userId = GetUserId();
        await _noteService.ArchiveNoteAsync(userId, id);
        return NoContent();
    }

    /// <summary>
    /// Unarchives a note.
    /// </summary>
    [HttpPut("{id}/unarchive")]
    public async Task<IActionResult> UnarchiveNote(int id)
    {
        var userId = GetUserId();
        await _noteService.UnarchiveNoteAsync(userId, id);
        return NoContent();
    }

    /// <summary>
    /// Permanently deletes a note.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNote(int id)
    {
        var userId = GetUserId();
        await _noteService.DeleteNoteAsync(userId, id);
        return NoContent();
    }

    /// <summary>
    /// Adds a category to a note.
    /// </summary>
    [HttpPost("{noteId}/categories/{categoryId}")]
    public async Task<IActionResult> AddCategoryToNote(int noteId, int categoryId)
    {
        var userId = GetUserId();
        await _noteService.AddCategoryToNoteAsync(userId, noteId, categoryId);
        return NoContent();
    }

    /// <summary>
    /// Removes a category from a note.
    /// </summary>
    [HttpDelete("{noteId}/categories/{categoryId}")]
    public async Task<IActionResult> RemoveCategoryFromNote(int noteId, int categoryId)
    {
        var userId = GetUserId();
        await _noteService.RemoveCategoryFromNoteAsync(userId, noteId, categoryId);
        return NoContent();
    }

    /// <summary>
    /// Gets notes filtered by category.
    /// </summary>
    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<List<NoteDTO>>> GetNotesByCategory(int categoryId)
    {
        var userId = GetUserId();
        var notes = await _noteService.GetNotesByCategoryAsync(userId, categoryId);
        return Ok(notes);
    }
}
