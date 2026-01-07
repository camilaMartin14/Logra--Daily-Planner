using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs
{
    public class TaskCreateDTO
    {
        [Required]
        [MaxLength(200)]
        public string Description { get; set; } = string.Empty;
    }
}
