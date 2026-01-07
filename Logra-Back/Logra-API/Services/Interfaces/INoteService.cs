using Logra_API.DTOs;

namespace Logra_API.Services.Interfaces;

public interface INoteService
{
    Task<NoteDTO> CreateAsync(int userId, NoteCreateDTO dto);

    Task<NoteDTO> GetByIdAsync(int userId, int noteId);

    Task<List<NoteDTO>> GetActiveAsync(int userId);

    Task<List<NoteDTO>> GetArchivedAsync(int userId);

    Task<NoteDTO> UpdateAsync(int userId, int noteId, NoteUpdateDTO dto);

    Task ArchiveAsync(int userId, int noteId);

    Task UnarchiveAsync(int userId, int noteId);

    Task DeleteAsync(int userId, int noteId);

    Task AddCategoryAsync(int userId, int noteId, int categoryId);

    Task RemoveCategoryAsync(int userId, int noteId, int categoryId);

    Task<List<NoteDTO>> GetByCategoryAsync(int userId, int categoryId);
}
