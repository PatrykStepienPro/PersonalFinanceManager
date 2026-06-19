namespace PFM.Contracts.Events;

public record TransactionCreated
{
    public Guid TransactionId { get; init; }
    public Guid UserId { get; init; }
    public decimal Amount { get; init; }
    public int CategoryId { get; init; }
    public string Type { get; init; } = string.Empty;
    public DateTime OccurredAt { get; init; }
}