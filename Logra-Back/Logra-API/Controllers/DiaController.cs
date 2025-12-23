using Logra_API.DTOs;
using Logra_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Logra_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DiaController : ControllerBase
    {
        private readonly IDiaService _service;

        public DiaController(IDiaService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var dia = await _service.ObtenerDiaPorIdAsync(id);
            if (dia == null)
                return NotFound();

            return Ok(dia);
        }

        [HttpGet("usuario/{usuarioId}/fecha/{fecha}")]
        public async Task<IActionResult> ObtenerOCrear(int usuarioId, DateOnly fecha)
        {
            var dia = await _service.ObtenerOCrearDiaAsync(usuarioId, fecha);
            return Ok(dia);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] DiaUpdateDTO dto)
        {
            var ok = await _service.ModificarDiaAsync(id, dto);
            if (!ok)
                return NotFound();

            return NoContent();
        }
    }
}
