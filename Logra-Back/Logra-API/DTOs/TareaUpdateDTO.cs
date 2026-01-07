using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs
{
    public class TaskUpdateDTO
    {
        [Required]
        [MaxLength(200)]
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
    }
}
