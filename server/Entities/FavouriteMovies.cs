using Microsoft.AspNetCore.Identity;

namespace server.Entities;

public class FavouriteMovies
{
    public int Id { get; set; }
    public string IdentityUserId { get; set; }
    public IdentityUser IdentityUser { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; }
}