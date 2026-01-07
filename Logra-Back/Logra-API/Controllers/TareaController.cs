using Logra_API.DTOs;
using Logra_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Logra_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api")]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _service;

        public TaskController(ITaskService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim?.Value, out var userId))
                throw new UnauthorizedAccessException("Invalid user ID in token");
            return userId;
        }

        [HttpPost("days/{dayId}/tasks")]
        public async Task<IActionResult> Create(int dayId, [FromBody] TaskCreateDTO dto)
        {
            var id = await _service.CreateTaskAsync(dayId, dto);
            return CreatedAtAction(nameof(GetById), new { id }, null);
        }

        [HttpGet("days/{dayId}/tasks")]
        public async Task<IActionResult> GetByDay(int dayId)
        {
            var tasks = await _service.GetTasksByDayAsync(dayId);
            return Ok(tasks);
        }

        [HttpGet("tasks/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        [HttpPut("tasks/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskUpdateDTO dto)
        {
            var ok = await _service.UpdateTaskAsync(id, dto);
            if (!ok)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("tasks/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteTaskAsync(id);
            if (!ok)
                return NotFound();

            return NoContent();
        }

        [HttpPost("tasks/{taskId}/categories/{categoryId}")]
        public async Task<IActionResult> AddCategoryToTask(int taskId, int categoryId)
        {
            var userId = GetUserId();
            await _service.AddCategoryToTaskAsync(userId, taskId, categoryId);
            return NoContent();
        }

        [HttpDelete("tasks/{taskId}/categories/{categoryId}")]
        public async Task<IActionResult> RemoveCategoryFromTask(int taskId, int categoryId)
        {
            var userId = GetUserId();
            await _service.RemoveCategoryFromTaskAsync(userId, taskId, categoryId);
            return NoContent();
        }

        [HttpGet("tasks/category/{categoryId}")]
        public async Task<IActionResult> GetTasksByCategory(int categoryId)
        {
            var userId = GetUserId();
            var tasks = await _service.GetTasksByCategoryAsync(userId, categoryId);
            return Ok(tasks);
        }
    }
}
