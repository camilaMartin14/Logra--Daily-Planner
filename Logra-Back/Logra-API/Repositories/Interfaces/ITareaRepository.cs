using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface ITareaRepository
    {
        Task <int> CrearTarea(Tarea tarea);
        Task<Tarea?> ObtenerTareaPorId(int idTarea);
        Task<List<Tarea>> ObtenerTareasPorDia(int diaId);
        Task<bool> ModificarTarea(Tarea tarea);
        Task<bool> EliminarTarea(int idTarea);
    }
}
