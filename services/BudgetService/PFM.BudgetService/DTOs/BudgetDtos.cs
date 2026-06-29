namespace PFM.BudgetService.DTOs;

public record CreateBudgetRequest(
    int CategoryId,
    string Month,
    decimal Limit
);

public class BudgetResponse
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Month { get; set; }
    public decimal Limit { get; set; }
    public decimal CurrentSpending { get; set; }
    public decimal RemainingBudget => Limit - CurrentSpending;
}