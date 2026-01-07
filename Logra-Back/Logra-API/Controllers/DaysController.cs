using Logra_API.DTOs;
using Logra_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Logra_API.Controllers;

[ApiController]
[Route("api/days")]
[Authorize]
public class DaysController : ControllerBase
{
    private readonly IDayService _service;

    public DaysController(IDayService service)
    {
        _service = service;
    }

    private int UserId =>
    int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _service.GetByIdAsync(UserId, id));

    [HttpGet("today")]
    public async Task<IActionResult> GetOrCreateToday()
        => Ok(await _service.GetOrCreateTodayAsync(UserId));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update( int id, DayUpdateDTO dto)
        => Ok(await _service.UpdateAsync(UserId, id, dto));
}
