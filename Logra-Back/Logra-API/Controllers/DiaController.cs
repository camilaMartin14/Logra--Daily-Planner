using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DiaController : ControllerBase
    {
        private readonly IDiaService _service;
        private readonly LograContext _context;

        public DiaController(IDiaService service, LograContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CrearDia([FromBody] DiaDTO dto)
        {
            if (dto.Fecha == default)
                return BadRequest("Fecha requerida");

            // Obtener UserId del token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier"));
            if (userIdClaim == null)
                return Unauthorized();

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            // Verificar que el usuario exista
            var userExists = await _context.Usuarios.AnyAsync(u => u.Id == userId);
            if (!userExists)
                return BadRequest("Usuario no encontrado");

            var dia = new Dia { Fecha = dto.Fecha, UsuarioId = userId };
            _context.Dias.Add(dia);
            await _context.SaveChangesAsync();

            return Ok(new { id = dia.Id });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var dia = await _service.ObtenerDiaPorIdAsync(id);
            if (dia == null)
                return NotFound();

            return Ok(dia);
        }

        [Authorize]
        [HttpGet("fecha/{fecha}")]
        public async Task<IActionResult> ObtenerOCrearDia(DateTime fecha)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier"));
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            // Buscar día existente
            var diaExistente = await _context.Dias
                .FirstOrDefaultAsync(d => d.UsuarioId == userId && d.Fecha == fecha);

            if (diaExistente != null)
                return Ok(diaExistente);

            // Crear nuevo día
            var nuevoDia = new Dia
            {
                UsuarioId = userId,
                Fecha = fecha,
                AguaConsumida = 0,
                HorasSueno = 0,
                Mood = null,
                NotaDia = null,
                NotaManiana = null,
                Desayuno = null,
                Almuerzo = null,
                Cena = null,
                Snack = null
            };

            _context.Dias.Add(nuevoDia);
            await _context.SaveChangesAsync();

            return Ok(nuevoDia);
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
