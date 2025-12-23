using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task <int> RegistrarUsuario(Usuario usuario);
        Task <Usuario?> ObtenerUsuarioPorId(int idUsuario);
        Task <Usuario?> ObtenerUsuarioPorEmail(string email);
    }
}
