using Microsoft.EntityFrameworkCore;

namespace Logra_API.Models
{
    public class LograContext : DbContext
    {
        public LograContext(DbContextOptions<LograContext> options)
        : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Day> Days { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<NoteCategory> NoteCategories { get; set; }
        public DbSet<TaskCategory> TaskCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.Property(u => u.FirstName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.LastName)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(c => c.Color)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(c => c.User)
                    .WithMany(u => u.Categories)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Day>(entity =>
            {
                entity.HasKey(d => d.Id);

                entity.Property(d => d.Date)
                    .IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(u => u.Days)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Description)
                    .IsRequired();

                entity.HasOne(t => t.Day)
                    .WithMany(d => d.Tasks)
                    .HasForeignKey(t => t.DayId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Note>(entity =>
            {
                entity.HasKey(n => n.Id);

                entity.Property(n => n.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(n => n.Content)
                    .IsRequired();

                entity.HasOne(n => n.User)
                    .WithMany(u => u.Notes)
                    .HasForeignKey(n => n.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<NoteCategory>(entity =>
            {
                entity.HasKey(nc => new { nc.NoteId, nc.CategoryId });

                entity.HasOne(nc => nc.Note)
                    .WithMany(n => n.NoteCategories)
                    .HasForeignKey(nc => nc.NoteId);

                entity.HasOne(nc => nc.Category)
                    .WithMany(c => c.NoteCategories)
                    .HasForeignKey(nc => nc.CategoryId);
            });

            modelBuilder.Entity<TaskCategory>(entity =>
            {
                entity.HasKey(tc => new { tc.TaskItemId, tc.CategoryId });

                entity.HasOne(tc => tc.TaskItem)
                    .WithMany(t => t.TaskCategories)
                    .HasForeignKey(tc => tc.TaskItemId);

                entity.HasOne(tc => tc.Category)
                    .WithMany(c => c.TaskCategories)
                    .HasForeignKey(tc => tc.CategoryId);
            });
        }
    }
}
