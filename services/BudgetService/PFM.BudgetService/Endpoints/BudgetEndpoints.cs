using Microsoft.EntityFrameworkCore;
using PFM.BudgetService.Data;
using PFM.BudgetService.DTOs;
using PFM.BudgetService.Entities;
using PFM.Contracts.Helpers;

namespace PFM.BudgetService.Endpoints;

public static class BudgetEndpoints
{
    public static void MapBudgetEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/budgets");

        group.MapGet("/", async (
            BudgetDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            var budgets = await db.Budgets
                .Where(x => x.UserId == userId)
                .Select(x => new BudgetResponse
                {
                    Id = x.Id,
                    CategoryId = x.CategoryId,
                    Month = x.Month,
                    Limit = x.Limit,
                    CurrentSpending = x.CurrentSpending
                })
                .ToListAsync();

            return Results.Ok(budgets);
        });

        group.MapPost("/", async (
            CreateBudgetRequest request,
            BudgetDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            if (!request.Month.IsValidYearMonth())
            {
                return Results.BadRequest("The month must be in 'yyyy-MM' format.");
            }

            var newBudget = new Budget
            {
                UserId = userId,
                CategoryId = request.CategoryId,
                Month = request.Month,
                Limit = request.Limit
            };
            db.Budgets.Add(newBudget);
            await db.SaveChangesAsync();

            return Results.Created($"/api/budgets/{newBudget.Id}",
                new BudgetResponse
                {
                    Id = newBudget.Id,
                    CategoryId = newBudget.CategoryId,
                    Month = newBudget.Month,
                    Limit = newBudget.Limit,
                    CurrentSpending = newBudget.CurrentSpending
                }
            );
        });

        group.MapDelete("/{id}", async (
            int id,
            BudgetDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            var budget = await db.Budgets.FindAsync(id);
            if (budget is null)
            {
                return Results.NotFound();
            }

            if (budget.UserId != userId)
            {
                return Results.Forbid();
            }

            db.Budgets.Remove(budget);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}