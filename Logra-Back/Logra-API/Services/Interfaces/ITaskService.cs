using Logra_API.DTOs;

namespace Logra_API.Services.Interfaces;

public interface ITaskService
{
    Task<TaskDTO> CreateAsync(int userId, int dayId, TaskCreateDTO dto);

    Task<TaskDTO> GetByIdAsync(int userId, int taskId);

    Task<List<TaskDTO>> GetByDayAsync(int userId, int dayId);

    Task<TaskDTO> UpdateAsync(int userId, int taskId, TaskUpdateDTO dto);

    Task DeleteAsync(int userId, int taskId);

    Task AddCategoryAsync(int userId, int taskId, int categoryId);

    Task RemoveCategoryAsync(int userId, int taskId, int categoryId);

    Task<List<TaskDTO>> GetByCategoryAsync(int userId, int categoryId);
}
