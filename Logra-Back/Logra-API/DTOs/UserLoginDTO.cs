using System.ComponentModel.DataAnnotations;

namespace Logra_API.DTOs
{
    public class UserLoginDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

    }
}
