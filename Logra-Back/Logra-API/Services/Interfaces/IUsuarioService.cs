using Logra_API.DTOs;
using Logra_API.Models;

namespace Logra_API.Services.Interfaces
{
    public interface IUsuarioService
    {
        int RegistrarUsuario(UsuarioRegistroDTO dto);
        UsuarioDTO? ObtenerUsuarioPorId(int idUsuario);
        UsuarioDTO? ObtenerUsuarioPorEmail(string email);
        UsuarioDTO? Login(string email, string contrasenia);
    }
}
