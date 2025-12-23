using Logra_API.Models;

namespace Logra_API.Repositories.Interfaces
{
    public interface IDiaRepository
    {
        int CrearDia(Dia dia);

        Dia? ObtenerDiaPorId(int idDia);

        Dia? ObtenerDiaPorUsuarioYFecha(int usuarioId, DateOnly fecha);

        bool ModificarDia(Dia dia);
    }
}
