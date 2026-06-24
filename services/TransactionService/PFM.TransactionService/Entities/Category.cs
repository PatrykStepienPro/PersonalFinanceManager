namespace PFM.TransactionService.Entities;

public class Category
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; }
    public string? Color { get; set; }
    public List<Transaction> Transactions { get; set; }
}