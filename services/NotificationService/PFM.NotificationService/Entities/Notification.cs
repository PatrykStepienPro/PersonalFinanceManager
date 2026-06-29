namespace PFM.NotificationService.Entities;

public class Notification
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Message  { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; } = false;
}