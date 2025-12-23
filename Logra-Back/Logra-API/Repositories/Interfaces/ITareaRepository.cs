using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface ITareaRepository
    {
        int CrearTarea(Tarea tarea);
        Tarea? ObtenerTareaPorId(int idTarea);
        List<Tarea> ObtenerTareasPorDia(int diaId);
        bool ModificarTarea(Tarea tarea);
        bool EliminarTarea(int idTarea);
    }
}
