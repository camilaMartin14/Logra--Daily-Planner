using Logra_API.DTOs;
using Logra_API.Models;

namespace Logra_API.Services.Interfaces
{
    public interface IDiaService
    {
            Task<bool> ModificarDiaAsync(int idDia, DiaUpdateDTO dto);
            Task<DiaDTO?> ObtenerDiaPorIdAsync(int idDia);
            Task<DiaDTO> ObtenerOCrearDiaAsync(int usuarioId, DateOnly fecha);

    }
}
