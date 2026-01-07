using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface ITaskRepository
    {
        Task <int> CreateTask(TaskItem task);
        Task<TaskItem?> GetTaskById(int taskId);
        Task<List<TaskItem>> GetTasksByDay(int dayId);
        Task<bool> UpdateTask(TaskItem task);
        Task<bool> DeleteTask(int taskId);
        Task AddCategoryToTaskAsync(int taskId, int categoryId);
        Task RemoveCategoryFromTaskAsync(int taskId, int categoryId);
        Task<List<TaskItem>> GetTasksByCategoryAsync(int userId, int categoryId);
    }
}
