using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _service;

    public TasksController(ITaskService service)
    {
        _service = service;
    }

    private int UserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _service.GetByIdAsync(UserId, id));

    [HttpGet("day/{dayId:int}")]
    public async Task<IActionResult> GetByDay(int dayId)
        => Ok(await _service.GetByDayAsync(UserId, dayId));

    [HttpGet("category/{categoryId:int}")]
    public async Task<IActionResult> GetByCategory(int categoryId)
        => Ok(await _service.GetByCategoryAsync(UserId, categoryId));

    [HttpPost("day/{dayId:int}")]
    public async Task<IActionResult> Create(int dayId, TaskCreateDTO dto)
        => Ok(await _service.CreateAsync(UserId, dayId, dto));

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TaskUpdateDTO dto)
        => Ok(await _service.UpdateAsync(UserId, id, dto));

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(UserId, id);
        return NoContent();
    }

    [HttpPost("{id:int}/categories/{categoryId:int}")]
    public async Task<IActionResult> AddCategory(int id, int categoryId)
    {
        await _service.AddCategoryAsync(UserId, id, categoryId);
        return NoContent();
    }

    [HttpDelete("{id:int}/categories/{categoryId:int}")]
    public async Task<IActionResult> RemoveCategory(int id, int categoryId)
    {
        await _service.RemoveCategoryAsync(UserId, id, categoryId);
        return NoContent();
    }
}
