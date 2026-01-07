using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Logra_API.Security;
using Logra_API.Services.Interfaces;

namespace Logra_API.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task<UserDTO?> LoginAsync(string email, string password)
        {
            var user = await _repo.GetUserByEmail(email);
            if (user == null)
                return null;

            if (!PasswordHasher.Verify(password, user.PasswordHash))
                return null;

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };
        }

        public async Task<UserDTO?> GetUserByEmailAsync(string email)
        {
            var user = await _repo.GetUserByEmail(email);
            if (user == null) return null;

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };
        }

        public async Task<UserDTO?> GetUserByIdAsync(int userId)
        {
            var user = await _repo.GetUserById(userId);
            if (user == null) return null;

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };
        }

        public async Task<int> RegisterUserAsync(UserRegisterDTO dto)
        {
            var existing = await _repo.GetUserByEmail(dto.Email);
            if (existing != null)
                throw new Exception("Email already registered");

            var user = new User
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                RegistrationDate = DateTime.UtcNow,
                PasswordHash = PasswordHasher.Hash(dto.Password)
            };

            return await _repo.RegisterUser(user);
        }
    }
}
