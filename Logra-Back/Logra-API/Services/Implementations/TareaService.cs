using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Logra_API.Services.Interfaces;
using Logra_API.Security;

namespace Logra_API.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repo;
        private readonly ICategoryRepository _categoryRepository;
        private readonly LograContext _context;
        private readonly EncryptionService _encryption;

        public TaskService(ITaskRepository repo, ICategoryRepository categoryRepository, LograContext context, EncryptionService encryption)
        {
            _repo = repo;
            _categoryRepository = categoryRepository;
            _context = context;
            _encryption = encryption;
        }

        public async Task<int> CreateTaskAsync(int dayId, TaskCreateDTO dto)
        {
            var task = new TaskItem
            {
                DayId = dayId,
                Description = _encryption.Encrypt(dto.Description),
                IsCompleted = false
            };

            return await _repo.CreateTask(task);
        }

        public async Task<bool> DeleteTaskAsync(int taskId)
        {
            return await _repo.DeleteTask(taskId);
        }

        public async Task<bool> UpdateTaskAsync(int taskId, TaskUpdateDTO dto)
        {
            var task = await _repo.GetTaskById(taskId);
            if (task == null) return false;

            task.Description = _encryption.Encrypt(dto.Description);
            task.IsCompleted = dto.IsCompleted;

            return await _repo.UpdateTask(task);
        }

        public async Task<TaskDTO?> GetTaskByIdAsync(int taskId)
        {
            var task = await _repo.GetTaskById(taskId);
            if (task == null) return null;

            return new TaskDTO
            {
                Id = task.Id,
                Description = _encryption.Decrypt(task.Description),
                IsCompleted = task.IsCompleted
            };
        }

        public async Task AddCategoryToTaskAsync(int userId, int taskId, int categoryId)
        {
            var task = await _repo.GetTaskById(taskId);
            if (task == null) throw new UnauthorizedAccessException("Task not found or access denied");

            var day = await _context.Days.FindAsync(task.DayId);
            if (day == null || day.UserId != userId) throw new UnauthorizedAccessException("Task not found or access denied");

            var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
            if (category == null || category.UserId != userId) throw new UnauthorizedAccessException("Category not found or access denied");

            await _repo.AddCategoryToTaskAsync(taskId, categoryId);
        }

        public async Task RemoveCategoryFromTaskAsync(int userId, int taskId, int categoryId)
        {
            var task = await _repo.GetTaskById(taskId);
            if (task == null) throw new UnauthorizedAccessException("Task not found or access denied");

            var day = await _context.Days.FindAsync(task.DayId);
            if (day == null || day.UserId != userId) throw new UnauthorizedAccessException("Task not found or access denied");

            await _repo.RemoveCategoryFromTaskAsync(taskId, categoryId);
        }

        public async Task<List<TaskDTO>> GetTasksByCategoryAsync(int userId, int categoryId)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
            if (category == null || category.UserId != userId) throw new UnauthorizedAccessException("Category not found or access denied");

            var tasks = await _repo.GetTasksByCategoryAsync(userId, categoryId);
            return tasks.Select(t => new TaskDTO
            {
                Id = t.Id,
                Description = _encryption.Decrypt(t.Description),
                IsCompleted = t.IsCompleted
            }).ToList();
        }

        public async Task<List<TaskDTO>> GetTasksByDayAsync(int dayId)
        {
            var tasks = await _repo.GetTasksByDay(dayId);

            return tasks
                .Select(t => new TaskDTO
                {
                    Id = t.Id,
                    Description = _encryption.Decrypt(t.Description),
                    IsCompleted = t.IsCompleted
                })
                .ToList();
        }
    }
}
