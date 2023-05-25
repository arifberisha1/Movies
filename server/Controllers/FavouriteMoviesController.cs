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