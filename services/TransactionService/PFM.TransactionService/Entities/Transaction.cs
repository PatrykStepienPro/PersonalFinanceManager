namespace PFM.TransactionService.Entities;

public class Transaction
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public TransactionType Type { get; set; }
    public DateOnly Date { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? CategoryId { get; set; }
    
    public Category? Category { get; set; }
}

public enum TransactionType
{
    Income,
    Expense
}