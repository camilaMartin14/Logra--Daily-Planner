using Logra_API.DTOs;
using Logra_API.Models;
using Logra_API.Repositories.Interfaces;
using Logra_API.Services.Interfaces;

namespace Logra_API.Services.Implementations
{
    public class DiaService : IDiaService
    {
        private readonly IDiaRepository _repo;
        public DiaService(IDiaRepository repo)
        {
            _repo = repo;
        }

        public bool ModificarDia(int idDia, DiaDTO dto)
        {
            var dia = _repo.ObtenerDiaPorId(idDia);
            if (dia == null) return false;

            dia.AguaConsumida = dto.AguaConsumida;
            dia.HorasSueno = dto.HorasSueno;
            dia.Mood = dto.Mood;
            dia.NotaDia = dto.NotaDia;
            dia.NotaManiana = dto.NotaManiana;
            dia.Desayuno = dto.Desayuno;
            dia.Almuerzo = dto.Almuerzo;
            dia.Cena = dto.Cena;
            dia.Snack = dto.Snack;


            return _repo.ModificarDia(dia);
        }

        public DiaDTO? ObtenerDiaPorId(int idDia)
        {
            var dia = _repo.ObtenerDiaPorId(idDia);
            if (dia == null) return null;

            return new DiaDTO
            {
                Fecha = dia.Fecha,
                AguaConsumida = dia.AguaConsumida,
                HorasSueno = dia.HorasSueno
            };
        }

        public DiaDTO ObtenerOCrearDia(int usuarioId, DateOnly fecha)
        {
            var dia = _repo.ObtenerDiaPorUsuarioYFecha(usuarioId, fecha);

            if (dia == null)
            {
                dia = new Dia
                {
                    UsuarioId = usuarioId,
                    Fecha = fecha,
                    AguaConsumida = 0,
                    HorasSueno = null
                };

                dia.Id = _repo.CrearDia(dia);
            }

            return new DiaDTO
            {
                Fecha = dia.Fecha,
                AguaConsumida = dia.AguaConsumida,
                HorasSueno = dia.HorasSueno
            };
        }
    }
}
