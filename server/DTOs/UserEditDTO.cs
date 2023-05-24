namespace server.DTOs;

public class UserEditDTO
{
    public string Email { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public DateTime Birthday { get; set; }
    public string Gender { get; set; }
    public string Address { get; set; }
}