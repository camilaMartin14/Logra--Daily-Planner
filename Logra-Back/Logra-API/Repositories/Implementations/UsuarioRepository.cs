using Logra_API.Models;
using Logra_API.Repositories.Interfaces;

namespace Logra_API.Repositories.Implementations
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly LograContext _context;
        public UsuarioRepository(LograContext context)
        {
            _context = context;
        }

        public Usuario? ObtenerUsuarioPorEmail(string email)
        {
            return _context.Usuarios
                .FirstOrDefault(u => u.Email == email);
        }

        public Usuario? ObtenerUsuarioPorId(int idUsuario)
        {
            return _context.Usuarios.Find(idUsuario);
        }

        public int RegistrarUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();
            return usuario.Id;
        }
    }
}
