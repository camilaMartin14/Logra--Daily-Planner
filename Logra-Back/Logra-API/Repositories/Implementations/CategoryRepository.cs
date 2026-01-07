using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Repositories.Implementations;

/// <summary>
/// Implementation of Category repository for database operations.
/// </summary>
public class CategoryRepository : ICategoryRepository
{
    private readonly LograContext _context;

    public CategoryRepository(LograContext context)
    {
        _context = context;
    }

    public async Task<Category> CreateCategoryAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category> GetCategoryByIdAsync(int categoryId)
    {
        return await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId);
    }

    public async Task<List<Category>> GetCategoriesByUserAsync(int userId)
    {
        return await _context.Categories
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Category> UpdateCategoryAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task DeleteCategoryAsync(int categoryId)
    {
        var category = await _context.Categories.FindAsync(categoryId);
        if (category != null)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
}
