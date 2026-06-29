namespace PFM.NotificationService.DTOs;

public record NotificationResponse(
    int Id,
    string Message,
    DateTime CreatedAt,
    bool IsRead
);