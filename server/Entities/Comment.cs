namespace server.Entities;

public class Comment
{
    public int Id { get; set; }
    public string UserComment { get; set; }
    public string UserEmail { get; set; }
    public int MovieId { get; set; }
}