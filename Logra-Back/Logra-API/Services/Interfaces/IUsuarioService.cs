using Logra_API.DTOs;

public interface IUsuarioService
{
    Task<UsuarioDTO?> LoginAsync(string email, string contrasenia);
    Task<UsuarioDTO?> ObtenerUsuarioPorEmailAsync(string email);
    Task<UsuarioDTO?> ObtenerUsuarioPorIdAsync(int idUsuario);
    Task<int> RegistrarUsuarioAsync(UsuarioRegistroDTO dto);
}

