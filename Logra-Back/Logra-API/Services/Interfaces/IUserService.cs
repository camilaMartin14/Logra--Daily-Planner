using Logra_API.DTOs;

namespace Logra_API.Services.Interfaces;

public interface IUserService
{
    Task<AuthResponseDTO> LoginAsync(string email, string password);

    Task<UserDTO> RegisterAsync(UserRegisterDTO dto);

    Task<UserDTO> GetByIdAsync(int userId);

    Task<UserDTO> GetByEmailAsync(string email);
}
