using Logra_API.Models;
using Logra_API.Repositories.Interfaces;

namespace Logra_API.Repositories.Implementations
{
    public class TareaRepository : ITareaRepository
    {
        private readonly LograContext _context;
        public TareaRepository(LograContext context)
        {
            _context = context;
        }

        public int CrearTarea(Tarea tarea)
        {
            _context.Tareas.Add(tarea);
            _context.SaveChanges();
            return tarea.Id;
        }

        public bool EliminarTarea(int idTarea)
        {
            var tarea = _context.Tareas.Find(idTarea);
            if (tarea == null)
                return false;

            _context.Tareas.Remove(tarea);
            _context.SaveChanges();
            return true;
        }

        public bool ModificarTarea(Tarea tarea)
        {
            var tareaExistente = _context.Tareas.Find(tarea.Id);
            if (tareaExistente == null)
                return false;

            tareaExistente.Descripcion = tarea.Descripcion;
            tareaExistente.Realizada = tarea.Realizada;

            _context.SaveChanges();
            return true;
        }

        public Tarea? ObtenerTareaPorId(int idTarea)
        {
            return _context.Tareas
                .FirstOrDefault(t => t.Id == idTarea);
        }

        public List<Tarea> ObtenerTareasPorDia(int diaId)
        {
            return _context.Tareas
                .Where(t => t.DiaId == diaId)
                .OrderBy(t => t.FechaCreacion)
                .ToList();
        }
    }
}
