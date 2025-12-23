using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface IDiaRepository
    {
        Task <int> CrearDia(Dia dia);
        Task <Dia?> ObtenerDiaPorId(int idDia);
        Task <Dia?> ObtenerDiaPorUsuarioYFecha(int usuarioId, DateOnly fecha);
        Task <bool> ModificarDia(Dia dia);
    }
}
