using Logra_API.DTOs;

namespace Logra_API.Services.Interfaces;

public interface ICategoryService
{
    Task<CategoryDTO> CreateAsync(int userId, CategoryCreateDTO dto);

    Task<CategoryDTO> GetByIdAsync(int userId, int categoryId);

    Task<List<CategoryDTO>> GetByUserAsync(int userId);

    Task<CategoryDTO> UpdateAsync(int userId, int categoryId, CategoryUpdateDTO dto);

    Task DeleteAsync(int userId, int categoryId);
}
