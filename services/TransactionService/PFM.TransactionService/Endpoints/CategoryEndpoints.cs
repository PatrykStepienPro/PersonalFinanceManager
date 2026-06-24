using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using PFM.Contracts.Helpers;
using PFM.TransactionService.Data;
using PFM.TransactionService.DTOs;
using PFM.TransactionService.Entities;

namespace PFM.TransactionService.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/categories");

        group.MapGet("/", async (
            TransactionDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);
            
            var response = await db.Categories
                .Where(c => c.UserId == userId)
                .Select(x => new CategoryResponse(x.Id, x.Name, x.Color))
                .ToListAsync();

            return Results.Ok(response);
        });

        group.MapPost("/", async (
            CreateCategoryRequest request,
            HttpContext httpContext,
            TransactionDbContext db) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            var newCategory = new Category
            {
                UserId = userId,
                Name = request.Name,
                Color = request.Color
            };

            db.Categories.Add(newCategory);
            await db.SaveChangesAsync();

            return Results.Created($"/api/categories/{newCategory.Id}",
                new CategoryResponse(newCategory.Id, newCategory.Name, newCategory.Color));
        });

        group.MapDelete("/{id}", async (
            int id,
            HttpContext httpContext,
            TransactionDbContext db) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            var category = await db.Categories
                .FindAsync(id);
            
            if (category == null)
                return Results.NotFound();
            
            if(category.UserId != userId)
                return Results.Forbid();
            
            db.Categories.Remove(category);
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        });
    }
}