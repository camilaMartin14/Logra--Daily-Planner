using System;

namespace Logra_API.DTOs;

/// <summary>
/// Data Transfer Object for retrieving category details.
/// </summary>
public class CategoryDTO
{
    /// <summary>
    /// Unique identifier of the category.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Name of the category.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Hex color code for the category.
    /// </summary>
    public string Color { get; set; } = string.Empty;

    /// <summary>
    /// Date when the category was created.
    /// </summary>
    public DateTime CreatedDate { get; set; }
}
