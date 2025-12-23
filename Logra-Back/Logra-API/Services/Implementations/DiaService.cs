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

        public bool ModificarDia(int idDia, DiaDTO diaDto)
        {
            throw new NotImplementedException();
        }

        public DiaDTO? ObtenerDiaPorId(int idDia)
        {
            throw new NotImplementedException();
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
                    HorasSueno = 0
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
