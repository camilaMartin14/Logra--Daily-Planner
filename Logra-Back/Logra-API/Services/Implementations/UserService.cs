using Logra_API.Data;
using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Security;
using Logra_API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Services.Implementations;

public class UserService : IUserService
{
    private readonly LograContext _context;

    public UserService(LograContext context)
    {
        _context = context;
    }

    public async Task<UserDTO> RegisterAsync(UserRegisterDTO dto)
    {
        var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);

        if (exists)
            throw new InvalidOperationException("Email already registered.");

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = PasswordHasher.Hash(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            RegistrationDate = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return MapToDTO(user);
    }

    public async Task<UserDTO> LoginAsync(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || !PasswordHasher.Verify(password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        return MapToDTO(user);
    }

    public async Task<UserDTO> GetByEmailAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        return MapToDTO(user);
    }

    public async Task<UserDTO> GetByIdAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        return MapToDTO(user);
    }

    private static UserDTO MapToDTO(User user) =>
        new()
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
}
