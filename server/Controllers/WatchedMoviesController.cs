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
public class WatchedMoviesController : ControllerBase
{
    private readonly ApplicationDbContext context;

    public WatchedMoviesController(ApplicationDbContext context)
    {
        this.context = context;
    }

    /// <summary>
    /// Retrieves a list of watched movies for a user by email.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <returns>A list of watched movies.</returns>
    /// <response code="200">The list of watched movies was successfully retrieved.</response>
    /// <response code="400">The provided email is invalid or no movies were found for the user.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<WatchedMovieDetailsDTO>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Adds a movie to the watched list for a user.
    /// </summary>
    /// <param name="watchedMoviesCreationDto">The DTO containing the movie ID and user email.</param>
    /// <returns>A response indicating the result of the operation.</returns>
    /// <response code="200">The movie was added to the watched list successfully.</response>
    /// <response code="400">The provided data is invalid or an error occurred.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Removes a movie from the watched list for a user.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <param name="movieId">The ID of the movie to remove.</param>
    /// <returns>A response indicating the result of the operation.</returns>
    /// <response code="200">The movie was removed from the watched list successfully.</response>
    /// <response code="404">The movie or user was not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Checks if a movie is in the watched list for a user.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <param name="movieId">The ID of the movie to check.</param>
    /// <returns>True if the movie is in the watched list, false otherwise.</returns>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
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