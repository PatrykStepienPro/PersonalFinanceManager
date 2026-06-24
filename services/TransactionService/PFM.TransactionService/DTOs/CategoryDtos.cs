namespace PFM.TransactionService.DTOs;

public record CreateCategoryRequest(
    string Name,
    string? Color
);

public record CategoryResponse(
    int Id,
    string Name,
    string? Color
);