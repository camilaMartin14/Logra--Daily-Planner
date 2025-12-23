using Logra_API.DTOs;
using Logra_API.Services.Interfaces;
using Logra_API.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Logra_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _service;
        private readonly JwtTokenGenerator _jwt;

        public UsuarioController(IUsuarioService service, JwtTokenGenerator jwt)
        {
            _service = service;
            _jwt = jwt;
        }

        [HttpPost("registro")]
        public async Task<IActionResult> Registrar([FromBody] UsuarioRegistroDTO dto)
        {
            try
            {
                var id = await _service.RegistrarUsuarioAsync(dto);
                return CreatedAtAction(nameof(ObtenerActual), new { id }, null);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO dto)
        {
            var usuario = await _service.LoginAsync(dto.Email, dto.Contrasenia);
            if (usuario == null)
                return Unauthorized();

            var token = _jwt.GenerateToken(usuario.Id, usuario.Email);

            return Ok(new
            {
                token,
                usuario
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> ObtenerActual()
        {
            var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (usuarioIdClaim == null)
                return Unauthorized();

            int usuarioId = int.Parse(usuarioIdClaim.Value);

            var usuario = await _service.ObtenerUsuarioPorIdAsync(usuarioId);
            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }
    }
}
