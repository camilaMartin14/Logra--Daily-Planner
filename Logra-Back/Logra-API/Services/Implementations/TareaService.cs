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

        public async Task<int> CrearTareaAsync(int diaId, TareaCreateDTO dto)
        {
            var tarea = new Tarea
            {
                DiaId = diaId,
                Descripcion = dto.Descripcion,
                Realizada = false
            };

            return await _repo.CrearTarea(tarea);
        }

        public async Task<bool> EliminarTareaAsync(int idTarea)
        {
            return await _repo.EliminarTarea(idTarea);
        }

        public async Task<bool> ActualizarTareaAsync(int idTarea, TareaUpdateDTO dto)
        {
            var tarea = await _repo.ObtenerTareaPorId(idTarea);
            if (tarea == null) return false;

            tarea.Descripcion = dto.Descripcion;
            tarea.Realizada = dto.Realizada;

            return await _repo.ModificarTarea(tarea);
        }

        public async Task<TareaDTO?> ObtenerTareaPorIdAsync(int idTarea)
        {
            var tarea = await _repo.ObtenerTareaPorId(idTarea);
            if (tarea == null) return null;

            return new TareaDTO
            {
                Id = tarea.Id,
                Descripcion = tarea.Descripcion,
                Realizada = tarea.Realizada
            };
        }

        public async Task<List<TareaDTO>> ObtenerTareasPorDiaAsync(int diaId)
        {
            var tareas = await _repo.ObtenerTareasPorDia(diaId);

            return tareas
                .Select(t => new TareaDTO
                {
                    Id = t.Id,
                    Descripcion = t.Descripcion,
                    Realizada = t.Realizada
                })
                .ToList();
        }
    }
}
