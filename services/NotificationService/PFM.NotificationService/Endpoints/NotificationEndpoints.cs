using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using PFM.Contracts.Helpers;
using PFM.NotificationService.Data;
using PFM.NotificationService.DTOs;

namespace PFM.NotificationService.Endpoints;

public static class NotificationEndpoints
{
    public static void MapNotificationEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/notifications");

        group.MapGet("/", async (
            NotificationDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            var notifications = await db.Notifications
                .Where(x => x.UserId == userId)
                .ToListAsync();
            var response = notifications.Select(x =>
                new NotificationResponse(
                    x.Id,
                    x.Message,
                    x.CreatedAt,
                    x.IsRead));
            return Results.Ok(response);
        });

        group.MapPut("/{id}/read", async (
            int id,
            NotificationDbContext db,
            HttpContext httpContext) =>
        {
            var userId = HttpContextHelper.UserIdGet(httpContext);

            var notification = await db.Notifications.FindAsync(id);
            if (notification == null)
                return Results.NotFound();

            if (notification.UserId != userId)
                return Results.Forbid();

            notification.IsRead = true;
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}