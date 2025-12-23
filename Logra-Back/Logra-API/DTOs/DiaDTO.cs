namespace Logra_API.DTOs
{
    public class DiaDTO
    {
        public DateOnly Fecha { get; set; }

        public string Mood { get; set; } = string.Empty;

        public string NotaDia { get; set; } = string.Empty;

        public string NotaManiana { get; set; } = string.Empty;

        public int AguaConsumida { get; set; }

        public int? HorasSueno { get; set; }

        public string Desayuno { get; set; } = string.Empty;

        public string Almuerzo { get; set; } = string.Empty;

        public string Cena { get; set; } = string.Empty;

        public string Snack { get; set; } = string.Empty;
    }
}
