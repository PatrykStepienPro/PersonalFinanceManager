using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace PFM.Contracts.Helpers;

public static class HttpContextHelper
{
    public static Guid UserIdGet(HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userId = Guid.Parse(userIdClaim!);
        return userId;
    }
}