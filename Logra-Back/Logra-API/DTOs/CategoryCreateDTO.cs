using System;
using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs;

/// <summary>
/// Data Transfer Object for creating a new category.
/// </summary>
public class CategoryCreateDTO
{
    /// <summary>
    /// Name of the category.
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Optional hex color code (e.g., #FF5733).
    /// </summary>
    [MaxLength(7)]
    public string Color { get; set; } = string.Empty;
}
