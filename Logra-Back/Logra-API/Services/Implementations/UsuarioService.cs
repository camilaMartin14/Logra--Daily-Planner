using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Logra_API.Security;
using Logra_API.Services.Interfaces;

namespace Logra_API.Services.Implementations
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repo;

        public UsuarioService(IUsuarioRepository repo)
        {
            _repo = repo;
        }

        public async Task<UsuarioDTO?> LoginAsync(string email, string contrasenia)
        {
            var usuario = await _repo.ObtenerUsuarioPorEmail(email);
            if (usuario == null)
                return null;

            if (!PasswordHasher.Verify(contrasenia, usuario.ContraseniaHash))
                return null;

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
            };
        }

        public async Task<UsuarioDTO?> ObtenerUsuarioPorEmailAsync(string email)
        {
            var usuario = await _repo.ObtenerUsuarioPorEmail(email);
            if (usuario == null) return null;

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
            };
        }

        public async Task<UsuarioDTO?> ObtenerUsuarioPorIdAsync(int idUsuario)
        {
            var usuario = await _repo.ObtenerUsuarioPorId(idUsuario);
            if (usuario == null) return null;

            return new UsuarioDTO
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
            };
        }

        public async Task<int> RegistrarUsuarioAsync(UsuarioRegistroDTO dto)
        {
            var existente = await _repo.ObtenerUsuarioPorEmail(dto.Email);
            if (existente != null)
                throw new Exception("El email ya está registrado");

            var usuario = new Usuario
            {
                Email = dto.Email,
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                FechaRegistro = DateTime.UtcNow,
                ContraseniaHash = PasswordHasher.Hash(dto.Contrasenia)
            };

            return await _repo.RegistrarUsuario(usuario);
        }
    }
}
