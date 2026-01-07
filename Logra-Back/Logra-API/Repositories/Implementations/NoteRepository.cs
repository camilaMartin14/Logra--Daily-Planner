using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Repositories.Implementations;

/// <summary>
/// Implementation of Note repository for database operations.
/// </summary>
public class NoteRepository : INoteRepository
{
    private readonly LograContext _context;

    public NoteRepository(LograContext context)
    {
        _context = context;
    }

    public async Task<Note> CreateNoteAsync(Note note)
    {
        _context.Notes.Add(note);
        await _context.SaveChangesAsync();
        return note;
    }

    public async Task<Note> GetNoteByIdAsync(int noteId)
    {
        return await _context.Notes
            .Include(n => n.NoteCategories)
            .ThenInclude(nc => nc.Category)
            .FirstOrDefaultAsync(n => n.Id == noteId);
    }

    public async Task<List<Note>> GetActiveNotesByUserAsync(int userId)
    {
        return await _context.Notes
            .Include(n => n.NoteCategories)
            .ThenInclude(nc => nc.Category)
            .Where(n => n.UserId == userId && !n.IsArchived)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<List<Note>> GetArchivedNotesByUserAsync(int userId)
    {
        return await _context.Notes
            .Include(n => n.NoteCategories)
            .ThenInclude(nc => nc.Category)
            .Where(n => n.UserId == userId && n.IsArchived)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<Note> UpdateNoteAsync(Note note)
    {
        note.UpdatedDate = DateTime.UtcNow;
        _context.Notes.Update(note);
        await _context.SaveChangesAsync();
        return note;
    }

    public async Task ArchiveNoteAsync(int noteId)
    {
        var note = await _context.Notes.FindAsync(noteId);
        if (note != null)
        {
            note.IsArchived = true;
            note.UpdatedDate = DateTime.UtcNow;
            _context.Notes.Update(note);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UnarchiveNoteAsync(int noteId)
    {
        var note = await _context.Notes.FindAsync(noteId);
        if (note != null)
        {
            note.IsArchived = false;
            note.UpdatedDate = DateTime.UtcNow;
            _context.Notes.Update(note);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteNoteAsync(int noteId)
    {
        var note = await _context.Notes.FindAsync(noteId);
        if (note != null)
        {
            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();
        }
    }

    public async Task AddCategoryToNoteAsync(int noteId, int categoryId)
    {
        var existing = await _context.NoteCategories.FirstOrDefaultAsync(nc => nc.NoteId == noteId && nc.CategoryId == categoryId);
        if (existing != null) return;

        var noteCategory = new NoteCategory
        {
            NoteId = noteId,
            CategoryId = categoryId
        };
        _context.NoteCategories.Add(noteCategory);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveCategoryFromNoteAsync(int noteId, int categoryId)
    {
        var noteCategory = await _context.NoteCategories
            .FirstOrDefaultAsync(nc => nc.NoteId == noteId && nc.CategoryId == categoryId);
        if (noteCategory != null)
        {
            _context.NoteCategories.Remove(noteCategory);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Note>> GetNotesByCategoryAsync(int userId, int categoryId)
    {
        return await _context.Notes
            .Include(n => n.NoteCategories)
            .ThenInclude(nc => nc.Category)
            .Where(n => n.UserId == userId && n.NoteCategories.Any(nc => nc.CategoryId == categoryId) && !n.IsArchived)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }
}
