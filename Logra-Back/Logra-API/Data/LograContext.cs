using Logra_API.Models;
using Microsoft.EntityFrameworkCore;

namespace Logra_API.Data
{
    public class LograContext : DbContext
    {
        public LograContext(DbContextOptions<LograContext> options)
        : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Day> Days { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<TaskCategory> TaskCategories { get; set; }
        public DbSet<NoteCategory> NoteCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // NoteCategory (many-to-many Note <-> Category)
            modelBuilder.Entity<NoteCategory>()
                .HasKey(nc => new { nc.NoteId, nc.CategoryId });

            modelBuilder.Entity<NoteCategory>()
                .HasOne(nc => nc.Note)
                .WithMany(n => n.NoteCategories)
                .HasForeignKey(nc => nc.NoteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NoteCategory>()
                .HasOne(nc => nc.Category)
                .WithMany(c => c.NoteCategories)
                .HasForeignKey(nc => nc.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // TaskCategory (many-to-many TaskItem <-> Category)
            modelBuilder.Entity<TaskCategory>()
                .HasKey(tc => new { tc.TaskItemId, tc.CategoryId });

            modelBuilder.Entity<TaskCategory>()
                .HasOne(tc => tc.TaskItem)
                .WithMany(t => t.TaskCategories)
                .HasForeignKey(tc => tc.TaskItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TaskCategory>()
                .HasOne(tc => tc.Category)
                .WithMany(c => c.TaskCategories)
                .HasForeignKey(tc => tc.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
