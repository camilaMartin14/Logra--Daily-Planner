using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Repositories.Implementations
{
    public class TareaRepository : ITareaRepository
    {
        private readonly LograContext _context;

        public TareaRepository(LograContext context)
        {
            _context = context;
        }

        public async Task<int> CrearTarea(Tarea tarea)
        {
            _context.Tareas.Add(tarea);
            await _context.SaveChangesAsync();
            return tarea.Id;
        }

        public async Task<bool> EliminarTarea(int idTarea)
        {
            var tarea = await _context.Tareas.FindAsync(idTarea);
            if (tarea == null)
                return false;

            _context.Tareas.Remove(tarea);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ModificarTarea(Tarea tarea)
        {
            var tareaExistente = await _context.Tareas.FindAsync(tarea.Id);
            if (tareaExistente == null)
                return false;

            tareaExistente.Descripcion = tarea.Descripcion;
            tareaExistente.Realizada = tarea.Realizada;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Tarea?> ObtenerTareaPorId(int idTarea)
        {
            return await _context.Tareas.FindAsync(idTarea);
        }

        public async Task<List<Tarea>> ObtenerTareasPorDia(int diaId)
        {
            return await _context.Tareas
                .Where(t => t.DiaId == diaId)
                .OrderBy(t => t.FechaCreacion)
                .ToListAsync();
        }
    }
}
