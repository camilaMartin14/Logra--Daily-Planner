using Logra_API.Models;

namespace Logra_API.DTOs
{
    public class UsuarioRegistroDTO
    {
        public string Email { get; set; }

        public string Contrasenia { get; set; }

        public string Nombre { get; set; }

        public string Apellido { get; set; }
    }
}
