using Logra_API.Models;
using Logra_API.Repositories.Interfaces;

namespace Logra_API.Repositories.Implementations
{
    public class DiaRepository : IDiaRepository
    {
        private readonly LograContext _context;
        public DiaRepository(LograContext context)
        {
            _context = context;
        }

        public int CrearDia(Dia dia)
        {
            _context.Dias.Add(dia);
            _context.SaveChanges();
            return dia.Id;
        }

        public bool ModificarDia(Dia dia)
        {
            _context.Dias.Update(dia);
            _context.SaveChanges();
            return true;
        }

        public Dia? ObtenerDiaPorId(int idDia)
        {
            return _context.Dias.Find(idDia);
        }

        public Dia? ObtenerDiaPorUsuarioYFecha(int usuarioId, DateOnly fecha)
        {
            return _context.Dias
               .FirstOrDefault(d => d.UsuarioId == usuarioId && d.Fecha == fecha);
        }
    }
}
