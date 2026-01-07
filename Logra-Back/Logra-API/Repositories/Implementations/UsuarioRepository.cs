using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly LograContext _context;

        public UserRepository(LograContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserById(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<int> RegisterUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.Id;
        }
    }
}
