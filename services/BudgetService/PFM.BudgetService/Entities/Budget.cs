namespace PFM.BudgetService.Entities;

public class Budget
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int CategoryId { get; set; }
    public string Month { get; set; } = String.Empty;
    public decimal Limit { get; set; }
    public decimal CurrentSpending { get; set; } = 0;
}