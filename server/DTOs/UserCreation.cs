using System.ComponentModel.DataAnnotations;

namespace server.DTOs;

public class UserCreation
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public DateTime Birthday { get; set; }
    public string Gender { get; set; }
    public string Address { get; set; }
}