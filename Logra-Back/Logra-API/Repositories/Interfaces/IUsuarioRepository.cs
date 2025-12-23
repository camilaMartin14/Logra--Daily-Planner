using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        int RegistrarUsuario(Usuario usuario);
        Usuario? ObtenerUsuarioPorId(int idUsuario);
        Usuario? ObtenerUsuarioPorEmail(string email);
    }
}
