using Logra_API.Models;

namespace Logra_API.DTOs
{
    public class DiaDTO
    {
        public DateOnly Fecha { get; set; }

        public string Mood { get; set; }

        public string NotaDia { get; set; }

        public string NotaManiana { get; set; }

        public int AguaConsumida { get; set; }

        public int? HorasSueno { get; set; }

        public string Desayuno { get; set; }

        public string Almuerzo { get; set; }

        public string Cena { get; set; }

        public string Snack { get; set; }
    }
}
