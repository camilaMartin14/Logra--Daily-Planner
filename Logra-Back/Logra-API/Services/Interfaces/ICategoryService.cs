using Logra_API.DTOs;
using Logra_API.Models;

namespace Logra_API.Services.Interfaces;

/// <summary>
/// Interface for Category business logic operations.
/// </summary>
public interface ICategoryService
{
    /// <summary>
    /// Creates a new category for a user.
    /// </summary>
    Task<CategoryDTO> CreateCategoryAsync(int userId, CategoryCreateDTO categoryCreateDTO);

    /// <summary>
    /// Gets a category by ID if it belongs to the authenticated user.
    /// </summary>
    Task<CategoryDTO> GetCategoryByIdAsync(int userId, int categoryId);

    /// <summary>
    /// Gets all categories for a user.
    /// </summary>
    Task<List<CategoryDTO>> GetCategoriesByUserAsync(int userId);

    /// <summary>
    /// Updates a category if it belongs to the authenticated user.
    /// </summary>
    Task<CategoryDTO> UpdateCategoryAsync(int userId, int categoryId, CategoryCreateDTO categoryUpdateDTO);

    /// <summary>
    /// Deletes a category.
    /// </summary>
    Task DeleteCategoryAsync(int userId, int categoryId);
}
