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
            var diaExistente = _context.Dias.Find(dia.Id);
            if (diaExistente == null)
                return false;

            diaExistente.Mood = dia.Mood;
            diaExistente.NotaDia = dia.NotaDia;
            diaExistente.NotaManiana = dia.NotaManiana;
            diaExistente.AguaConsumida = dia.AguaConsumida;
            diaExistente.HorasSueno = dia.HorasSueno;
            diaExistente.Desayuno = dia.Desayuno;
            diaExistente.Almuerzo = dia.Almuerzo;
            diaExistente.Cena = dia.Cena;
            diaExistente.Snack = dia.Snack;

            _context.SaveChanges();
            return true;
        }

        public Dia? ObtenerDiaPorId(int idDia)
        {
            return _context.Dias
                .FirstOrDefault(d => d.Id == idDia);
        }

        public Dia? ObtenerDiaPorUsuarioYFecha(int usuarioId, DateOnly fecha)
        {
            return _context.Dias
               .FirstOrDefault(d => d.UsuarioId == usuarioId && d.Fecha == fecha);
        }
    }
}
