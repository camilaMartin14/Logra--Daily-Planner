using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/notes")]
[Authorize]
public class NotesController : ControllerBase
{
    private readonly INoteService _service;

    public NotesController(INoteService service)
    {
        _service = service;
    }

    private int UserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
        => Ok(await _service.GetActiveAsync(UserId));

    [HttpGet("archived")]
    public async Task<IActionResult> GetArchived()
        => Ok(await _service.GetArchivedAsync(UserId));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _service.GetByIdAsync(UserId, id));

    [HttpPost]
    public async Task<IActionResult> Create(NoteCreateDTO dto)
    {
        var note = await _service.CreateAsync(UserId, dto);
        return CreatedAtAction(nameof(GetById), new { id = note.Id }, note);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, NoteUpdateDTO dto)
        => Ok(await _service.UpdateAsync(UserId, id, dto));

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(UserId, id);
        return NoContent();
    }

    [HttpPost("{id:int}/archive")]
    public async Task<IActionResult> Archive(int id)
    {
        await _service.ArchiveAsync(UserId, id);
        return NoContent();
    }

    [HttpPost("{id:int}/unarchive")]
    public async Task<IActionResult> Unarchive(int id)
    {
        await _service.UnarchiveAsync(UserId, id);
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
