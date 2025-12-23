using Logra_API.DTOs;
using Logra_API.Models;

namespace Logra_API.Services.Interfaces
{
    public interface IDiaService
    {
        DiaDTO ObtenerOCrearDia(int usuarioId, DateOnly fecha);
        DiaDTO? ObtenerDiaPorId(int idDia);
        bool ModificarDia(int idDia, DiaDTO dto);
    }
}
