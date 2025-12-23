using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Repositories.Implementations
{
    public class DiaRepository : IDiaRepository
    {
        private readonly LograContext _context;

        public DiaRepository(LograContext context)
        {
            _context = context;
        }

        public async Task<int> CrearDia(Dia dia)
        {
            _context.Dias.Add(dia);
            await _context.SaveChangesAsync();
            return dia.Id;
        }

        public async Task<bool> ModificarDia(Dia dia)
        {
            _context.Dias.Update(dia);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Dia?> ObtenerDiaPorId(int idDia)
        {
            return await _context.Dias.FindAsync(idDia);
        }

        public async Task<Dia?> ObtenerDiaPorUsuarioYFecha(int usuarioId, DateOnly fecha)
        {
            return await _context.Dias
                .FirstOrDefaultAsync(d => d.UsuarioId == usuarioId && d.Fecha == fecha);
        }
    }
}
