using Microsoft.EntityFrameworkCore;
using PFM.TransactionService.Entities;

namespace PFM.TransactionService.Data;

public class TransactionDbContext(DbContextOptions<TransactionDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("transactions");
        
        modelBuilder.Entity<Category>(e =>
        {
            e.ToTable("Categories");
            e.HasKey(u => u.Id);
        });
        
        modelBuilder.Entity<Transaction>(e =>
        {
            e.ToTable("Transactions");
            e.HasKey(u => u.Id);
            e.HasOne(u => u.Category)
                .WithMany(c => c.Transactions)
                .OnDelete(DeleteBehavior.SetNull);
        }); 
    }
}