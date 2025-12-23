using Logra_API.DTOs;

public interface ITareaService
{
    Task<int> CrearTareaAsync(int diaId, TareaCreateDTO dto);
    Task<bool> EliminarTareaAsync(int idTarea);
    Task<bool> ActualizarTareaAsync(int idTarea, TareaUpdateDTO dto);
    Task<TareaDTO?> ObtenerTareaPorIdAsync(int idTarea);
    Task<List<TareaDTO>> ObtenerTareasPorDiaAsync(int diaId);
}
