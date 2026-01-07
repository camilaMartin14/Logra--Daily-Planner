using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Logra_API.DTOs;
using Logra_API.Services.Interfaces;

namespace Logra_API.Controllers;

/// <summary>
/// API controller for managing note categories.
/// </summary>
[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>
    /// Gets the current authenticated user ID from the JWT token.
    /// </summary>
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim?.Value, out var userId))
            throw new UnauthorizedAccessException("Invalid user ID in token");
        return userId;
    }

    /// <summary>
    /// Creates a new category for the authenticated user.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<CategoryDTO>> CreateCategory([FromBody] CategoryCreateDTO categoryCreateDTO)
    {
        var userId = GetUserId();
        var categoryDTO = await _categoryService.CreateCategoryAsync(userId, categoryCreateDTO);
        return CreatedAtAction(nameof(GetCategoryById), new { id = categoryDTO.Id }, categoryDTO);
    }

    /// <summary>
    /// Gets a specific category by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDTO>> GetCategoryById(int id)
    {
        var userId = GetUserId();
        var categoryDTO = await _categoryService.GetCategoryByIdAsync(userId, id);
        return Ok(categoryDTO);
    }

    /// <summary>
    /// Gets all categories for the authenticated user.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<CategoryDTO>>> GetCategories()
    {
        var userId = GetUserId();
        var categories = await _categoryService.GetCategoriesByUserAsync(userId);
        return Ok(categories);
    }

    /// <summary>
    /// Updates an existing category.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<CategoryDTO>> UpdateCategory(int id, [FromBody] CategoryCreateDTO categoryUpdateDTO)
    {
        var userId = GetUserId();
        var categoryDTO = await _categoryService.UpdateCategoryAsync(userId, id, categoryUpdateDTO);
        return Ok(categoryDTO);
    }

    /// <summary>
    /// Deletes a category.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var userId = GetUserId();
        await _categoryService.DeleteCategoryAsync(userId, id);
        return NoContent();
    }
}
