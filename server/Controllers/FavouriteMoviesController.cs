using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;

namespace server.Controllers;

[ApiController]
[Route("api/favourite")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class FavouriteMoviesController : ControllerBase
{
    private readonly ApplicationDbContext context;

    public FavouriteMoviesController(ApplicationDbContext context)
    {
        this.context = context;
    }

    /// <summary>
    /// Retrieves the favourite movies for a user by their email.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <returns>A list of favourite movie details for the user.</returns>
    /// <response code="200">Indicates that the favourite movies were retrieved successfully.</response>
    /// <response code="400">If the user email is invalid or if a movie does not exist in the database.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<FavouriteMovieDetailsDTO>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpGet("getByUserEmail/{email}")]
    public async Task<ActionResult<List<FavouriteMovieDetailsDTO>>> GetByUserEmail(string email)
    {
        var MovieList = new List<FavouriteMovieDetailsDTO>();
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email);

        var favourites = await context.FavouriteMovies
            .Where(x => x.IdentityUserId == user.Id).OrderByDescending(x => x.Id).ToListAsync();


        if (favourites.Count == 0)
        {
            return MovieList;
        }

        foreach (var favourite in favourites)
        {
            var movie = await context.Movies.FirstOrDefaultAsync(x => x.Id == favourite.MovieId);
            if (movie == null)
            {
                return BadRequest("Movie does not exist!");
            }

            var favouriteMovieDetailsDto = new FavouriteMovieDetailsDTO()
            {
                Id = movie.Id,
                Title = movie.Title,
                Poster = movie.Poster
            };

            MovieList.Add(favouriteMovieDetailsDto);
        }

        return MovieList;
    }

    /// <summary>
    /// Adds a movie to the user's favorite list.
    /// </summary>
    /// <param name="favouriteMoviesCreationDto">The details of the movie to add to the favorite list.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    /// <response code="200">Indicates that the movie was added to the favorite list successfully.</response>
    /// <response code="400">If the request body is invalid or an error occurred while adding the movie to the favorite list.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpPost("create")]
    public async Task<ActionResult> Create([FromBody] FavouriteMoviesCreationDTO favouriteMoviesCreationDto)
    {
        if (favouriteMoviesCreationDto == null)
        {
            return BadRequest();
        }

        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == favouriteMoviesCreationDto.Email);

        var favouriteMovies = new FavouriteMovies()
        {
            MovieId = favouriteMoviesCreationDto.MovieId,
            IdentityUser = user
        };

        try
        {
            await context.AddAsync(favouriteMovies);
            await context.SaveChangesAsync();
            return Ok("Movie added to favourite list successfully!");
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    /// <summary>
    /// Removes a movie from the user's favorite list.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <param name="movieId">The ID of the movie to remove from the favorite list.</param>
    /// <returns>A response indicating the success of the operation.</returns>
    /// <response code="200">Indicates that the movie was removed from the favorite list successfully.</response>
    /// <response code="404">If the user or the movie is not found in the favorite list.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpDelete("delete/{email}/{movieId:int}")]
    public async Task<ActionResult> Delete(string email, int movieId)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email);
        var favouriteMovies = await context.FavouriteMovies
            .Where(x => x.IdentityUserId == user.Id).ToListAsync();

        if (favouriteMovies == null)
        {
            return NotFound();
        }

        var favourite = new FavouriteMovies();

        foreach (var favouriteMovie in favouriteMovies)
        {
            if (favouriteMovie.MovieId == movieId)
            {
                favourite = favouriteMovie;
            }
        }

        context.FavouriteMovies.Remove(favourite);
        await context.SaveChangesAsync();
        return Ok("Movie removed from favourites successfully!");
    }

    /// <summary>
    /// Checks if a movie is in the user's favorite list.
    /// </summary>
    /// <param name="email">The email of the user.</param>
    /// <param name="movieId">The ID of the movie to check.</param>
    /// <returns>True if the movie is in the favorite list, false otherwise.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("isFavourite/{email}/{movieId:int}")]
    public async Task<ActionResult<bool>> IsFavourite(string email, int movieId)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email);
        var isFavourite = await context.FavouriteMovies
            .FirstOrDefaultAsync(x => x.IdentityUserId == user.Id && x.MovieId == movieId);
        if (isFavourite == null)
        {
            return false;
        }

        return true;
    }
}