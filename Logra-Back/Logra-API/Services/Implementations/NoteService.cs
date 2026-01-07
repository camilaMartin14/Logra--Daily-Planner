using Logra_API.Data;
using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Services.Implementations;

public class NoteService : INoteService
{
    private readonly LograContext _context;

    public NoteService(LograContext context)
    {
        _context = context;
    }

    public async Task<NoteDTO> CreateAsync(int userId, NoteCreateDTO dto)
    {
        var note = new Note
        {
            UserId = userId,
            Title = dto.Title,
            Content = dto.Content,
            CreatedDate = DateTime.UtcNow,
            IsArchived = false
        };

        _context.Notes.Add(note);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(userId, note.Id);
    }

    public async Task<NoteDTO> GetByIdAsync(int userId, int noteId)
    {
        var note = await _context.Notes
            .Include(n => n.NoteCategories)
            .ThenInclude(nc => nc.Category)
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);

        if (note == null)
            throw new KeyNotFoundException("Note not found.");

        return MapToDTO(note);
    }

    public async Task<List<NoteDTO>> GetActiveAsync(int userId)
    {
        return await _context.Notes
            .Where(n => n.UserId == userId && !n.IsArchived)
            .Select(n => MapToDTO(n))
            .ToListAsync();
    }

    public async Task<List<NoteDTO>> GetArchivedAsync(int userId)
    {
        return await _context.Notes
            .Where(n => n.UserId == userId && n.IsArchived)
            .Select(n => MapToDTO(n))
            .ToListAsync();
    }

    public async Task<NoteDTO> UpdateAsync(int userId, int noteId, NoteUpdateDTO dto)
    {
        var note = await _context.Notes
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);

        if (note == null)
            throw new KeyNotFoundException("Note not found.");

        note.Title = dto.Title;
        note.Content = dto.Content;
        note.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(userId, noteId);
    }

    public async Task ArchiveAsync(int userId, int noteId)
    {
        var note = await _context.Notes
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);

        if (note == null)
            throw new KeyNotFoundException("Note not found.");

        note.IsArchived = true;
        await _context.SaveChangesAsync();
    }

    public async Task UnarchiveAsync(int userId, int noteId)
    {
        var note = await _context.Notes
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);

        if (note == null)
            throw new KeyNotFoundException("Note not found.");

        note.IsArchived = false;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int userId, int noteId)
    {
        var note = await _context.Notes
            .FirstOrDefaultAsync(n => n.Id == noteId && n.UserId == userId);

        if (note == null)
            throw new KeyNotFoundException("Note not found.");

        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();
    }

    public async Task AddCategoryAsync(int userId, int noteId, int categoryId)
    {
        var exists = await _context.NoteCategories
            .AnyAsync(x => x.NoteId == noteId && x.CategoryId == categoryId);

        if (exists) return;

        _context.NoteCategories.Add(new NoteCategory
        {
            NoteId = noteId,
            CategoryId = categoryId
        });

        await _context.SaveChangesAsync();
    }

    public async Task RemoveCategoryAsync(int userId, int noteId, int categoryId)
    {
        var relation = await _context.NoteCategories
            .FirstOrDefaultAsync(x => x.NoteId == noteId && x.CategoryId == categoryId);

        if (relation == null) return;

        _context.NoteCategories.Remove(relation);
        await _context.SaveChangesAsync();
    }

    public async Task<List<NoteDTO>> GetByCategoryAsync(int userId, int categoryId)
    {
        return await _context.Notes
            .Where(n => n.UserId == userId &&
                        n.NoteCategories.Any(c => c.CategoryId == categoryId))
            .Select(n => MapToDTO(n))
            .ToListAsync();
    }

    private static NoteDTO MapToDTO(Note note) =>
        new()
        {
            Id = note.Id,
            Title = note.Title,
            Content = note.Content,
            IsArchived = note.IsArchived,
            CreatedDate = note.CreatedDate,
            UpdatedDate = note.UpdatedDate,
            Categories = note.NoteCategories
                .Select(c => new CategoryDTO
                {
                    Id = c.Category.Id,
                    Name = c.Category.Name,
                    Color = c.Category.Color,
                    CreatedDate = c.Category.CreatedDate
                }).ToList()
        };
}
