using Logra_API.DTOs;

public interface ITaskService
{
    Task<int> CreateTaskAsync(int dayId, TaskCreateDTO dto);
    Task<bool> DeleteTaskAsync(int taskId);
    Task<bool> UpdateTaskAsync(int taskId, TaskUpdateDTO dto);
    Task<TaskDTO?> GetTaskByIdAsync(int taskId);
    Task<List<TaskDTO>> GetTasksByDayAsync(int dayId);
    Task AddCategoryToTaskAsync(int userId, int taskId, int categoryId);
    Task RemoveCategoryFromTaskAsync(int userId, int taskId, int categoryId);
    Task<List<TaskDTO>> GetTasksByCategoryAsync(int userId, int categoryId);
}
