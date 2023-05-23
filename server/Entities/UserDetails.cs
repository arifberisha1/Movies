using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class UserDetails
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public DateTime Birthday { get; set; }
    public string Gender { get; set; }
    public string Address { get; set; }
    [Required]
    public string Email { get; set; }
}