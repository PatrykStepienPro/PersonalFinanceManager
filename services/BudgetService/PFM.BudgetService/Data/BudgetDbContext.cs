using Microsoft.EntityFrameworkCore;
using PFM.BudgetService.Entities;

namespace PFM.BudgetService.Data;

public class BudgetDbContext(DbContextOptions<BudgetDbContext> options) : DbContext(options)
{
    public DbSet<Budget> Budgets => Set<Budget>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("budgets");
        
        modelBuilder.Entity<Budget>(e =>
        {
            e.ToTable("Budgets");
            e.HasKey(u => u.Id);
        }); 
    }
}