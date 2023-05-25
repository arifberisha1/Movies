namespace server.DTOs;

public class CommentCreationDTO
{
    public string UserComment { get; set; }
    public string UserEmail { get; set; }
    public int MovieId { get; set; }
}