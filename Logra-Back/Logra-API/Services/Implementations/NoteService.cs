using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Logra_API.Services.Interfaces;

namespace Logra_API.Services.Implementations;

/// <summary>
/// Implementation of Note service for business logic.
/// </summary>
public class NoteService : INoteService
{
    private readonly INoteRepository _noteRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly LograContext _context;

    public NoteService(INoteRepository noteRepository, ICategoryRepository categoryRepository, LograContext context)
    {
        _noteRepository = noteRepository;
        _categoryRepository = categoryRepository;
        _context = context;
    }

    public async Task<NoteDTO> CreateNoteAsync(int userId, NoteCreateDTO noteCreateDTO)
    {
        var note = new Note
        {
            UserId = userId,
            Title = noteCreateDTO.Title,
            Content = noteCreateDTO.Content,
            IsArchived = false,
            CreatedDate = DateTime.UtcNow
        };

        await _noteRepository.CreateNoteAsync(note);
        return MapNoteToDTO(note);
    }

    public async Task<NoteDTO> GetNoteByIdAsync(int userId, int noteId)
    {
        var note = await _noteRepository.GetNoteByIdAsync(noteId);
        if (note == null || note.UserId != userId)
            throw new UnauthorizedAccessException("Note not found or access denied");

        return MapNoteToDTO(note);
    }

    public async Task<List<NoteDTO>> GetActiveNotesAsync(int userId)
    {
        var notes = await _noteRepository.GetActiveNotesByUserAsync(userId);
        return notes.Select(MapNoteToDTO).ToList();
    }

    public async Task<List<NoteDTO>> GetArchivedNotesAsync(int userId)
    {
        var notes = await _noteRepository.GetArchivedNotesByUserAsync(userId);
        return notes.Select(MapNoteToDTO).ToList();
    }

    public async Task<NoteDTO> UpdateNoteAsync(int userId, int noteId, NoteUpdateDTO noteUpdateDTO)
    {
        var note = await _noteRepository.GetNoteByIdAsync(noteId);
        if (note == null || note.UserId != userId)
            throw new UnauthorizedAccessException("Note not found or access denied");

        note.Title = noteUpdateDTO.Title;
        note.Content = noteUpdateDTO.Content;
        note.UpdatedDate = DateTime.UtcNow;

        await _noteRepository.UpdateNoteAsync(note);
        return MapNoteToDTO(note);
    }

    public async Task ArchiveNoteAsync(int userId, int noteId)
    {
        var note = await _noteRepository.GetNoteByIdAsync(noteId);
        if (note == null || note.UserId != userId)
            throw new UnauthorizedAccessException("Note not found or access denied");

        await _noteRepository.ArchiveNoteAsync(noteId);
    }

    public async Task UnarchiveNoteAsync(int userId, int noteId)
    {
        var note = await _noteRepository.GetNoteByIdAsync(noteId);
        if (note == null || note.UserId != userId)
            throw new UnauthorizedAccessException("Note not found or access denied");

        await _noteRepository.UnarchiveNoteAsync(noteId);
    }

    public async Task DeleteNoteAsync(int userId, int noteId)
    {
        var note = await _noteRepository.GetNoteByIdAsync(noteId);
        if (note == null || note.UserId != userId)
            throw new UnauthorizedAccessException("Note not found or access denied");

        await _noteRepository.DeleteNoteAsync(noteId);
    }

    public async Task AddCategoryToNoteAsync(int userId, int noteId, int categoryId)
    {
        var note = await _noteRepository.GetNoteByIdAsync(noteId);
        if (note == null || note.UserId != userId)
            throw new UnauthorizedAccessException("Note not found or access denied");

        var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
        if (category == null || category.UserId != userId)
            throw new UnauthorizedAccessException("Category not found or access denied");

        await _noteRepository.AddCategoryToNoteAsync(noteId, categoryId);
    }

    public async Task RemoveCategoryFromNoteAsync(int userId, int noteId, int categoryId)
    {
        var note = await _noteRepository.GetNoteByIdAsync(noteId);
        if (note == null || note.UserId != userId)
            throw new UnauthorizedAccessException("Note not found or access denied");

        await _noteRepository.RemoveCategoryFromNoteAsync(noteId, categoryId);
    }

    public async Task<List<NoteDTO>> GetNotesByCategoryAsync(int userId, int categoryId)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
        if (category == null || category.UserId != userId)
            throw new UnauthorizedAccessException("Category not found or access denied");

        var notes = await _noteRepository.GetNotesByCategoryAsync(userId, categoryId);
        return notes.Select(MapNoteToDTO).ToList();
    }

    private NoteDTO MapNoteToDTO(Note note)
    {
        return new NoteDTO
        {
            Id = note.Id,
            Title = note.Title,
            Content = note.Content,
            IsArchived = note.IsArchived,
            CreatedDate = note.CreatedDate,
            UpdatedDate = note.UpdatedDate,
            Categories = note.NoteCategories?.Select(nc => new CategoryDTO
            {
                Id = nc.Category.Id,
                Name = nc.Category.Name,
                Color = nc.Category.Color,
                CreatedDate = nc.Category.CreatedDate
            }).ToList() ?? new()
        };
    }
}
