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
// [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class FavouriteMoviesController : ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;

    public FavouriteMoviesController(ApplicationDbContext context)
    {
        this.context = context;
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

}