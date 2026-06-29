using MassTransit;
using PFM.Contracts.Events;
using PFM.NotificationService.Data;
using PFM.NotificationService.Entities;

namespace PFM.NotificationService.Consumers;

public class MonthlyBudgetExceededConsumer(NotificationDbContext db)
    : IConsumer<MonthlyBudgetExceeded>
{
    public async Task Consume(ConsumeContext<MonthlyBudgetExceeded> context)
    {
        var message = context.Message;
        await db.Notifications.AddAsync(new Notification
        {
            UserId = message.UserId,
            Message =   $"Przekroczono budżet dla kategorii {message.CategoryId} w miesiącu {message.Month}. Limit: {message.BudgetLimit}, wydano: {message.CurrentSpending}",
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();
    }
}