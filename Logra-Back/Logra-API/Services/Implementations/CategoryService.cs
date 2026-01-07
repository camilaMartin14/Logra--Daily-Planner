using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Logra_API.Services.Interfaces;

namespace Logra_API.Services.Implementations;

/// <summary>
/// Implementation of Category service for business logic.
/// </summary>
public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<CategoryDTO> CreateCategoryAsync(int userId, CategoryCreateDTO categoryCreateDTO)
    {
        var category = new Category
        {
            UserId = userId,
            Name = categoryCreateDTO.Name,
            Color = categoryCreateDTO.Color,
            CreatedDate = DateTime.UtcNow
        };

        await _categoryRepository.CreateCategoryAsync(category);
        return MapCategoryToDTO(category);
    }

    public async Task<CategoryDTO> GetCategoryByIdAsync(int userId, int categoryId)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
        if (category == null || category.UserId != userId)
            throw new UnauthorizedAccessException("Category not found or access denied");

        return MapCategoryToDTO(category);
    }

    public async Task<List<CategoryDTO>> GetCategoriesByUserAsync(int userId)
    {
        var categories = await _categoryRepository.GetCategoriesByUserAsync(userId);
        return categories.Select(MapCategoryToDTO).ToList();
    }

    public async Task<CategoryDTO> UpdateCategoryAsync(int userId, int categoryId, CategoryCreateDTO categoryUpdateDTO)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
        if (category == null || category.UserId != userId)
            throw new UnauthorizedAccessException("Category not found or access denied");

        category.Name = categoryUpdateDTO.Name;
        category.Color = categoryUpdateDTO.Color;

        await _categoryRepository.UpdateCategoryAsync(category);
        return MapCategoryToDTO(category);
    }

    public async Task DeleteCategoryAsync(int userId, int categoryId)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
        if (category == null || category.UserId != userId)
            throw new UnauthorizedAccessException("Category not found or access denied");

        await _categoryRepository.DeleteCategoryAsync(categoryId);
    }

    private CategoryDTO MapCategoryToDTO(Category category)
    {
        return new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name,
            Color = category.Color,
            CreatedDate = category.CreatedDate
        };
    }
}
