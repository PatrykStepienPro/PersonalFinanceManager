using System.Security.Claims;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PFM.Contracts.Events;
using PFM.Contracts.Helpers;
using PFM.TransactionService.Data;
using PFM.TransactionService.DTOs;
using PFM.TransactionService.Entities;

namespace PFM.TransactionService.Endpoints;

public static class TransactionEndpoints
{
    public static void MapTransactionEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/transactions");

        group.MapGet("/", async (
                TransactionDbContext db,
                HttpContext httpContext) =>
            {
                var userId = HttpContextHelper.UserIdGet(httpContext);

                var response = await db.Transactions
                    .Include(t => t.Category)
                    .Where(x => x.UserId == userId)
                    .Select(transaction => new TransactionResponse(
                        transaction.Id,
                        transaction.Amount,
                        transaction.Description,
                        transaction.Type.ToString().ToLower(),
                        transaction.Date,
                        transaction.CreatedAt,
                        transaction.Category != null
                            ? transaction.Category.Name
                            : null))
                    .ToListAsync();

                return Results.Ok(response);
            }
        );

        group.MapPost("/", async (
            CreateTransactionRequest request,
            TransactionDbContext db,
            IPublishEndpoint publishEndpoint,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            if (!Enum.TryParse<TransactionType>(request.Type, ignoreCase: true, out var type))
                return Results.BadRequest("Nieprawidłowy typ transakcji");

            var newTransaction = new Transaction
            {
                UserId = userId,
                Amount = request.Amount,
                Description = request.Description,
                Type = type,
                Date = request.Date,
                CreatedAt = DateTime.UtcNow,
                CategoryId = request.CategoryId,
            };

            db.Transactions.Add(newTransaction);
            await db.SaveChangesAsync();

            await publishEndpoint.Publish(new TransactionCreated
            {
                TransactionId = newTransaction.Id,
                UserId = userId,
                Amount = newTransaction.Amount,
                CategoryId = newTransaction.CategoryId ?? 0,
                Type = newTransaction.Type.ToString().ToLower(),
                OccurredAt = DateTime.UtcNow
            });

            return Results.Created(
                $"/api/transactions/{newTransaction.Id}",
                new TransactionResponse(
                    newTransaction.Id,
                    newTransaction.Amount,
                    newTransaction.Description,
                    newTransaction.Type.ToString().ToLower(),
                    newTransaction.Date,
                    newTransaction.CreatedAt,
                    newTransaction.Category?.Name
                )
            );
        });

        group.MapPut("/{id}", async (
            int id,
            UpdateTransactionRequest request,
            TransactionDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);
            
            var transaction = await db.Transactions.FindAsync(id);
            if (transaction == null)
                return Results.NotFound("Nie znalezione transakcji o takim Id");

            if (transaction.UserId != userId)
                return Results.Forbid();
            
            if (!Enum.TryParse<TransactionType>(request.Type, ignoreCase: true, out var type))
                return Results.BadRequest("Nieprawidłowy typ transakcji");


            transaction.Amount = request.Amount;
            transaction.Description = request.Description;
            transaction.Type = type;
            transaction.Date = request.Date;
            transaction.CategoryId = request.CategoryId;

            db.Update(transaction);
            await db.SaveChangesAsync();

            return Results.Ok();
        });

        group.MapDelete("/{id}", async (
            int id,
            TransactionDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);
            
            var transaction = await db.Transactions.FindAsync(id);
            if (transaction == null)
                return Results.NotFound();
    
            if(transaction.UserId != userId)
                return Results.Forbid();
            
            db.Transactions.Remove(transaction);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        group.MapGet("/summary", async (
            [FromQuery] string month,
            TransactionDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            if (!DateOnly.TryParseExact(
                    month + "-01",
                    "yyyy-MM-dd",
                    out var date))
            {
                return Results.BadRequest(
                    "Month must be in format yyyy-MM");
            }

            var start = date;
            var end = start.AddMonths(1);

            var transactions = await db.Transactions
                .Where(x => x.UserId == userId)
                .Where(x =>
                    x.Date >= start &&
                    x.Date < end)
                .ToListAsync();

            var response = new TransactionSummaryResponse
            {
                TotalIncome = transactions
                    .Where(x => x.Type == TransactionType.Income)
                    .Sum(x => x.Amount),
                TotalExpenses = transactions
                    .Where(x => x.Type == TransactionType.Expense)
                    .Sum(x => x.Amount)
            };

            return Results.Ok(response);
        });
    }
}