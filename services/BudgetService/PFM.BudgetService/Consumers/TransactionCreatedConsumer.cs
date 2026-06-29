using MassTransit;
using Microsoft.EntityFrameworkCore;
using PFM.BudgetService.Data;
using PFM.Contracts.Events;

namespace PFM.BudgetService.Consumers;

public class TransactionCreatedConsumer(BudgetDbContext db, IPublishEndpoint publishEndpoint)
    : IConsumer<TransactionCreated>
{
    public async Task Consume(ConsumeContext<TransactionCreated> context)
    {
        var message = context.Message;

        var month = message.OccurredAt.ToString("yyyy-MM");
        var budget = await db.Budgets
            .Where(x =>
                x.UserId == message.UserId &&
                x.CategoryId == message.CategoryId &&
                x.Month == month)
            .FirstOrDefaultAsync();
        if (budget is null)
            return;
        
        budget.CurrentSpending += message.Amount;
        await db.SaveChangesAsync();

        if (budget.CurrentSpending > budget.Limit)
        {
            await publishEndpoint.Publish(new MonthlyBudgetExceeded
            {
                UserId = budget.UserId,
                CategoryId = budget.CategoryId,
                BudgetLimit = budget.Limit,
                CurrentSpending = budget.CurrentSpending,
                Month = month
            });
        }
    }
}