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

        public async Task<bool> ModificarDiaAsync(int idDia, DiaUpdateDTO dto)
        {
            var dia = await _repo.ObtenerDiaPorId(idDia);
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

            return await _repo.ModificarDia(dia);
        }

        public async Task<DiaDTO?> ObtenerDiaPorIdAsync(int idDia)
        {
            var dia = await _repo.ObtenerDiaPorId(idDia);
            if (dia == null) return null;

            return MapToDTO(dia);
        }

        public async Task<DiaDTO> ObtenerOCrearDiaAsync(int usuarioId)
        {
            var fechaHoy = DateTime.Today;

            var dia = await _repo.ObtenerDiaPorUsuarioYFecha(usuarioId, fechaHoy);
            if (dia == null)
            {
                dia = CrearDiaPorDefecto(usuarioId, fechaHoy);
                dia.Id = await _repo.CrearDia(dia);
            }

            return MapToDTO(dia);
        }

        private Dia CrearDiaPorDefecto(int usuarioId, DateTime fecha)
        {
            return new Dia
            {
                Fecha = fecha,
                Mood = "",
                NotaDia = "",
                NotaManiana = "",
                AguaConsumida = 0,
                HorasSueno = 0,
                Desayuno = "",
                Almuerzo = "",
                Cena = "",
                Snack = ""
            };
        }

        private DiaDTO MapToDTO(Dia dia) => new DiaDTO
        {
            Id = dia.Id,
            Fecha = dia.Fecha,
            Mood = dia.Mood,
            NotaDia = dia.NotaDia,
            NotaManiana = dia.NotaManiana,
            AguaConsumida = dia.AguaConsumida,
            HorasSueno = dia.HorasSueno,
            Desayuno = dia.Desayuno,
            Almuerzo = dia.Almuerzo,
            Cena = dia.Cena,
            Snack = dia.Snack
        };
    }
}
