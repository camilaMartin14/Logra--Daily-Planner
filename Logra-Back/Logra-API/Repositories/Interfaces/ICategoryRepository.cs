using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces;

/// <summary>
/// Interface for Category repository operations.
/// </summary>
public interface ICategoryRepository
{
    /// <summary>
    /// Creates a new category.
    /// </summary>
    Task<Category> CreateCategoryAsync(Category category);

    /// <summary>
    /// Gets a category by its ID.
    /// </summary>
    Task<Category> GetCategoryByIdAsync(int categoryId);

    /// <summary>
    /// Gets all categories for a user.
    /// </summary>
    Task<List<Category>> GetCategoriesByUserAsync(int userId);

    /// <summary>
    /// Updates an existing category.
    /// </summary>
    Task<Category> UpdateCategoryAsync(Category category);

    /// <summary>
    /// Deletes a category.
    /// </summary>
    Task DeleteCategoryAsync(int categoryId);
}
