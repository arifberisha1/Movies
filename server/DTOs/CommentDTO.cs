namespace server.DTOs;

public class CommentDTO
{
    public int Id { get; set; }
    public string UserComment { get; set; }
    public string UserEmail { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public int MovieId { get; set; }
}