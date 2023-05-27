using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace server.Entities;

public class MovieTheater
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(maximumLength: 75)]
    public string Name { get; set; }

    public string Link { get; set; }
    public Point Location { get; set; }

}