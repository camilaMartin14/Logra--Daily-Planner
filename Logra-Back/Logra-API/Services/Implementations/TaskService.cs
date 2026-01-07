using Logra_API.Data;
using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Services.Implementations;

public class TaskService : ITaskService
{
    private readonly LograContext _context;

    public TaskService(LograContext context)
    {
        _context = context;
    }

    public async Task<TaskDTO> CreateAsync(int userId, int dayId, TaskCreateDTO dto)
    {
        var day = await _context.Days
            .FirstOrDefaultAsync(d => d.Id == dayId && d.UserId == userId);

        if (day == null)
            throw new KeyNotFoundException("Day not found.");

        var task = new TaskItem
        {
            DayId = dayId,
            Description = dto.Description,
            IsCompleted = false,
            CreatedDate = DateTime.UtcNow
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return MapToDTO(task);
    }

    public async Task<TaskDTO> GetByIdAsync(int userId, int taskId)
    {
        var task = await _context.Tasks
            .Include(t => t.Day)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.Day.UserId == userId);

        if (task == null)
            throw new KeyNotFoundException("Task not found.");

        return MapToDTO(task);
    }

    public async Task<List<TaskDTO>> GetByDayAsync(int userId, int dayId)
    {
        return await _context.Tasks
            .Include(t => t.Day)
            .Where(t => t.DayId == dayId && t.Day.UserId == userId)
            .Select(t => MapToDTO(t))
            .ToListAsync();
    }

    public async Task<List<TaskDTO>> GetByCategoryAsync(int userId, int categoryId)
    {
        return await _context.TaskCategories
            .Include(tc => tc.TaskItem)
                .ThenInclude(t => t.Day)
            .Where(tc =>
                tc.CategoryId == categoryId &&
                tc.TaskItem.Day.UserId == userId
            )
            .Select(tc => MapToDTO(tc.TaskItem))
            .ToListAsync();
    }

    public async Task<TaskDTO> UpdateAsync(int userId, int taskId, TaskUpdateDTO dto)
    {
        var task = await _context.Tasks
            .Include(t => t.Day)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.Day.UserId == userId);

        if (task == null)
            throw new KeyNotFoundException("Task not found.");

        task.Description = dto.Description;
        task.IsCompleted = dto.IsCompleted;

        await _context.SaveChangesAsync();

        return MapToDTO(task);
    }

    public async Task DeleteAsync(int userId, int taskId)
    {
        var task = await _context.Tasks
            .Include(t => t.Day)
            .Include(t => t.TaskCategories)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.Day.UserId == userId);

        if (task == null)
            throw new KeyNotFoundException("Task not found.");

        if (task.TaskCategories != null && task.TaskCategories.Any())
        {
            _context.TaskCategories.RemoveRange(task.TaskCategories);
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
    }

    public async Task AddCategoryAsync(int userId, int taskId, int categoryId)
    {
        var task = await _context.Tasks
            .Include(t => t.Day)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.Day.UserId == userId);

        if (task == null)
            throw new KeyNotFoundException("Task not found.");

        var exists = await _context.TaskCategories.AnyAsync(tc =>
            tc.TaskItemId == taskId && tc.CategoryId == categoryId);

        if (exists)
            return;

        _context.TaskCategories.Add(new TaskCategory
        {
            TaskItemId = taskId,
            CategoryId = categoryId
        });

        await _context.SaveChangesAsync();
    }

    public async Task RemoveCategoryAsync(int userId, int taskId, int categoryId)
    {
        var relation = await _context.TaskCategories
            .Include(tc => tc.TaskItem)
                .ThenInclude(t => t.Day)
            .FirstOrDefaultAsync(tc =>
                tc.TaskItemId == taskId &&
                tc.CategoryId == categoryId &&
                tc.TaskItem.Day.UserId == userId
            );

        if (relation == null)
            return;

        _context.TaskCategories.Remove(relation);
        await _context.SaveChangesAsync();
    }

    private static TaskDTO MapToDTO(TaskItem task) =>
        new()
        {
            Id = task.Id,
            Description = task.Description,
            IsCompleted = task.IsCompleted
        };
}
