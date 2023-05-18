namespace server.DTOs;

public class LandingPageDTO
{
    public List<MovieDTO> InTheaters { get; set; }
    public List<MovieDTO> UpcomingReleases { get; set; }
}