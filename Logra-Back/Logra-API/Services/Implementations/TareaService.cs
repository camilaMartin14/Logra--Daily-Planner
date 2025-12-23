using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Logra_API.Services.Interfaces;

namespace Logra_API.Services.Implementations
{
    public class TareaService : ITareaService
    {
        private readonly ITareaRepository _repo;
        public TareaService(ITareaRepository repo)
        {
            _repo = repo;
        }

        public int CrearTarea(int diaId, TareaDTO dto)
        {
            var tarea = new Tarea
            {
                DiaId = diaId,
                Descripcion = dto.Descripcion,
                Realizada = false
            };

            return _repo.CrearTarea(tarea);
        }

        public bool EliminarTarea(int idTarea)
        {
            return _repo.EliminarTarea(idTarea);
        }

        public bool MarcarTareaComoRealizada(int idTarea, bool realizada)
        {
            var tarea = _repo.ObtenerTareaPorId(idTarea);
            if (tarea == null) return false;

            tarea.Realizada = realizada;
            return _repo.ModificarTarea(tarea);
        }

        public TareaDTO? ObtenerTareaPorId(int idTarea)
        {
            var tarea = _repo.ObtenerTareaPorId(idTarea);
            if (tarea == null) return null;

            return new TareaDTO
            {
                Descripcion = tarea.Descripcion,
                Realizada = tarea.Realizada
            };
        }

        public List<TareaDTO> ObtenerTareasPorDia(int diaId)
        {
            return _repo.ObtenerTareasPorDia(diaId)
                .Select(t => new TareaDTO
                {
                    Descripcion = t.Descripcion,
                    Realizada = t.Realizada
                })
                .ToList();
        }
    }
}
