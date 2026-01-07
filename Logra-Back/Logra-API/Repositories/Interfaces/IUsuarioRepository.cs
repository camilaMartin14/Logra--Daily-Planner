using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task <int> RegisterUser(User user);
        Task <User?> GetUserById(int userId);
        Task <User?> GetUserByEmail(string email);
    }
}
