using System.ComponentModel.DataAnnotations;

namespace server.DTOs;

public class WebsiteCreationDTO
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Link { get; set; }
    public IFormFile Picture { get; set; }
}