namespace PFM.Contracts.Events;

public record NotificationCreated
{
    public Guid UserId { get; init; }
    public string Message { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}