using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;

namespace server.Controllers;

[ApiController]
    [Route("api/watched")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class WatchedMoviesController: ControllerBase
{
    private readonly ApplicationDbContext context;

    public WatchedMoviesController(ApplicationDbContext context)
    {
        this.context = context;
    }
    
    [HttpGet("getByUserEmail/{email}")]
    public async Task<ActionResult<List<WatchedMovieDetailsDTO>>> GetByUserEmail(string email)
    {
        var MovieList = new List<WatchedMovieDetailsDTO>();
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email);

        var watched = await context.WatchedMovies
            .Where(x => x.IdentityUserId == user.Id).OrderByDescending(x => x.Id).ToListAsync();


        if (watched.Count == 0)
        {
            return MovieList;
        }

        foreach (var watch in watched)
        {
            var movie = await context.Movies.FirstOrDefaultAsync(x => x.Id == watch.MovieId);
            if (movie == null)
            {
                return BadRequest("Movie does not exist!");
            }

            var watchedMovieDetailsDto = new WatchedMovieDetailsDTO()
            {
                Id = movie.Id,
                Title = movie.Title,
                Poster = movie.Poster
            };

            MovieList.Add(watchedMovieDetailsDto);
        }

        return MovieList;
    }
    
    [HttpPost("create")]
    public async Task<ActionResult> Create([FromBody] WatchedMoviesCreationDTO watchedMoviesCreationDto)
    {
        if (watchedMoviesCreationDto == null)
        {
            return BadRequest();
        }

        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == watchedMoviesCreationDto.Email);

        var watchedMovies = new WatchedMovies()
        {
            MovieId = watchedMoviesCreationDto.MovieId,
            IdentityUser = user
        };

        try
        {
            await context.AddAsync(watchedMovies);
            await context.SaveChangesAsync();
            return Ok("Movie added to watched list successfully!");
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
    
    [HttpDelete("delete/{email}/{movieId:int}")]
    public async Task<ActionResult> Delete(string email, int movieId)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email);
        var watchedMovies = await context.WatchedMovies
            .Where(x => x.IdentityUserId == user.Id).ToListAsync();

        if (watchedMovies == null)
        {
            return NotFound();
        }

        var watched = new WatchedMovies();

        foreach (var watchedMovie in watchedMovies)
        {
            if (watchedMovie.MovieId == movieId)
            {
                watched = watchedMovie;
            }
        }

        context.WatchedMovies.Remove(watched);
        await context.SaveChangesAsync();
        return Ok("Movie removed from watched successfully!");
    }
    
    [HttpGet("isWatched/{email}/{movieId:int}")]
    public async Task<ActionResult<bool>> IsWatched(string email, int movieId)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email);
        var isWatched = await context.WatchedMovies
            .FirstOrDefaultAsync(x => x.IdentityUserId == user.Id && x.MovieId == movieId);
        if (isWatched == null)
        {
            return false;
        }

        return true;
    }
    
}