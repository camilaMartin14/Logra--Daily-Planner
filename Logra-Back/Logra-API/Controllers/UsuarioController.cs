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
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly JwtTokenGenerator _jwt;

        public UserController(IUserService service, JwtTokenGenerator jwt)
        {
            _service = service;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO dto)
        {
            try
            {
                var id = await _service.RegisterUserAsync(dto);
                return CreatedAtAction(nameof(GetCurrent), new { id }, null);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO dto)
        {
            var user = await _service.LoginAsync(dto.Email, dto.Password);
            if (user == null)
                return Unauthorized();

            var token = _jwt.GenerateToken(user.Id, user.Email);

            return Ok(new
            {
                token,
                user
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrent()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var user = await _service.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound();

            return Ok(user);
        }
    }
}
