using Logra_API.Data;
using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly LograContext _context;

    public CategoryService(LograContext context)
    {
        _context = context;
    }

    public async Task<CategoryDTO> CreateAsync(int userId, CategoryCreateDTO dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Color = dto.Color,
            UserId = userId,
            CreatedDate = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return MapToDTO(category);
    }

    public async Task<CategoryDTO> GetByIdAsync(int userId, int categoryId)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId);

        if (category == null)
            throw new KeyNotFoundException("Category not found.");

        return MapToDTO(category);
    }

    public async Task<List<CategoryDTO>> GetByUserAsync(int userId)
    {
        return await _context.Categories
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .Select(c => MapToDTO(c))
            .ToListAsync();
    }

    public async Task<CategoryDTO> UpdateAsync(int userId, int categoryId, CategoryUpdateDTO dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId);

        if (category == null)
            throw new KeyNotFoundException("Category not found.");

        category.Name = dto.Name;
        category.Color = dto.Color;

        await _context.SaveChangesAsync();

        return MapToDTO(category);
    }

    public async Task DeleteAsync(int userId, int categoryId)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId);

        if (category == null)
            throw new KeyNotFoundException("Category not found.");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }

    private static CategoryDTO MapToDTO(Category category) =>
        new()
        {
            Id = category.Id,
            Name = category.Name,
            Color = category.Color,
            CreatedDate = category.CreatedDate
        };
}
