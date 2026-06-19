namespace PFM.Contracts.Events;

public record MonthlyBudgetExceeded
{
    public Guid UserId { get; init; }
    public int CategoryId { get; init; }
    public decimal BudgetLimit { get; init; }
    public decimal CurrentSpending { get; init; }
    public string Month { get; init; } = string.Empty;
}