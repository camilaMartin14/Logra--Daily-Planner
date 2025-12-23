using Logra_API.DTOs;
using Logra_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logra_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api")]
    public class TareaController : ControllerBase
    {
        private readonly ITareaService _service;

        public TareaController(ITareaService service)
        {
            _service = service;
        }

        [HttpPost("dias/{diaId}/tareas")]
        public async Task<IActionResult> Crear(int diaId, [FromBody] TareaCreateDTO dto)
        {
            var id = await _service.CrearTareaAsync(diaId, dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id }, null);
        }

        [HttpGet("dias/{diaId}/tareas")]
        public async Task<IActionResult> ObtenerPorDia(int diaId)
        {
            var tareas = await _service.ObtenerTareasPorDiaAsync(diaId);
            return Ok(tareas);
        }

        [HttpGet("tareas/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var tarea = await _service.ObtenerTareaPorIdAsync(id);
            if (tarea == null)
                return NotFound();

            return Ok(tarea);
        }

        [HttpPut("tareas/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] TareaUpdateDTO dto)
        {
            var ok = await _service.ActualizarTareaAsync(id, dto);
            if (!ok)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("tareas/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var ok = await _service.EliminarTareaAsync(id);
            if (!ok)
                return NotFound();

            return NoContent();
        }
    }
}
