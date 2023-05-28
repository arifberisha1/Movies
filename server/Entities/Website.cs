using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class Website
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Link { get; set; }
    public string Picture { get; set; }
}