using Microsoft.EntityFrameworkCore;
using PFM.AuthService.Data;
using PFM.AuthService.DTOs;
using PFM.AuthService.Entities;
using PFM.AuthService.Services;

namespace PFM.AuthService.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth");

        group.MapPost("/register", async (RegisterRequest request, AuthDbContext db) =>
        {
            if (await db.Users.AnyAsync(u => u.Email == request.Email))
                return Results.Conflict("Email już istnieje.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return Results.Created($"/api/auth/users/{user.Id}", new { user.Id, user.Email });
        });

        group.MapPost("/login", async (LoginRequest request, AuthDbContext db, TokenService tokenService) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Results.Unauthorized();

            var token = tokenService.GenerateToken(user);

            return Results.Ok(new AuthResponse(token, user.Id, user.Email));
        });
    }
}
