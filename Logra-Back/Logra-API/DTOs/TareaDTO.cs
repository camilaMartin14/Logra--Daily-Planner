namespace Logra_API.DTOs
{
    public class TaskDTO
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }

    }
}
