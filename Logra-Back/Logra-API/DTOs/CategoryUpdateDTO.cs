using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs
{
    public class CategoryUpdateDTO
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Name { get; set; } = null!;

        [StringLength(7)]
        public string? Color { get; set; }
    }
}