using Logra_API.DTOs;
using Logra_API.Models;

namespace Logra_API.Services.Interfaces
{
    public interface ITareaService
    {
        int CrearTarea(int diaId, TareaDTO dto);
        TareaDTO? ObtenerTareaPorId(int idTarea);
        List<TareaDTO> ObtenerTareasPorDia(int diaId);
        bool MarcarTareaComoRealizada(int idTarea, bool realizada);
        bool EliminarTarea(int idTarea);
    }
}
