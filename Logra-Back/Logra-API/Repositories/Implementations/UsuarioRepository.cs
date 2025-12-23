using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Repositories.Implementations
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly LograContext _context;

        public UsuarioRepository(LograContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> ObtenerUsuarioPorEmail(string email)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<Usuario?> ObtenerUsuarioPorId(int idUsuario)
        {
            return await _context.Usuarios.FindAsync(idUsuario);
        }

        public async Task<int> RegistrarUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario.Id;
        }
    }
}
