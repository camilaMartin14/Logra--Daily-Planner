using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Repositories.Implementations
{
    public class TaskRepository : ITaskRepository
    {
        private readonly LograContext _context;

        public TaskRepository(LograContext context)
        {
            _context = context;
        }

        public async Task<int> CreateTask(TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task.Id;
        }

        public async Task<bool> DeleteTask(int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTask(TaskItem task)
        {
            var existingTask = await _context.Tasks.FindAsync(task.Id);
            if (existingTask == null)
                return false;

            existingTask.Description = task.Description;
            existingTask.IsCompleted = task.IsCompleted;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TaskItem?> GetTaskById(int taskId)
        {
            return await _context.Tasks.FindAsync(taskId);
        }

        public async Task<List<TaskItem>> GetTasksByDay(int dayId)
        {
            return await _context.Tasks
                .Where(t => t.DayId == dayId)
                .OrderBy(t => t.CreatedDate)
                .ToListAsync();
        }

        public async Task AddCategoryToTaskAsync(int taskId, int categoryId)
        {
            var existing = await _context.TaskCategories.FirstOrDefaultAsync(tc => tc.TaskItemId == taskId && tc.CategoryId == categoryId);
            if (existing != null) return;

            var taskCategory = new TaskCategory
            {
                TaskItemId = taskId,
                CategoryId = categoryId
            };
            _context.TaskCategories.Add(taskCategory);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveCategoryFromTaskAsync(int taskId, int categoryId)
        {
            var taskCategory = await _context.TaskCategories
                .FirstOrDefaultAsync(tc => tc.TaskItemId == taskId && tc.CategoryId == categoryId);
            if (taskCategory != null)
            {
                _context.TaskCategories.Remove(taskCategory);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<TaskItem>> GetTasksByCategoryAsync(int userId, int categoryId)
        {
            return await _context.Tasks
                .Include(t => t.TaskCategories)
                .ThenInclude(tc => tc.Category)
                .Include(t => t.Day)
                .Where(t => t.Day.UserId == userId && t.TaskCategories.Any(tc => tc.CategoryId == categoryId))
                .OrderBy(t => t.CreatedDate)
                .ToListAsync();
        }
    }
}
