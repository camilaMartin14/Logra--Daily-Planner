using Logra_API.DTOs;

public interface IUserService
{
    Task<UserDTO?> LoginAsync(string email, string password);
    Task<UserDTO?> GetUserByEmailAsync(string email);
    Task<UserDTO?> GetUserByIdAsync(int userId);
    Task<int> RegisterUserAsync(UserRegisterDTO dto);
}

