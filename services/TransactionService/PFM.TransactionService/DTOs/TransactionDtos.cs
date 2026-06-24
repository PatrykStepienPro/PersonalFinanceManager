namespace PFM.TransactionService.DTOs;

public record CreateTransactionRequest(
    decimal Amount,
    string Description,
    string Type,
    DateOnly Date,
    int? CategoryId
);

public record UpdateTransactionRequest(
    decimal Amount,
    string Description,
    string Type,
    DateOnly Date,
    int? CategoryId
);

public record TransactionResponse(
    int Id,
    decimal Amount,
    string Description,
    string Type,
    DateOnly Date,
    DateTime CreatedAt,
    string? CategoryName
);

public class TransactionSummaryResponse
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance => TotalIncome - TotalExpenses;
}
