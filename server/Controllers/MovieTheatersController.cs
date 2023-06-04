using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/movietheaters")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
public class MovieTheatersController : ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;

    public MovieTheatersController(ApplicationDbContext context, IMapper mapper)
    {
        this.context = context;
        this.mapper = mapper;
    }

    /// <summary>
    /// Retrieves a paginated list of movie theaters.
    /// </summary>
    /// <param name="paginationDTO">Pagination parameters.</param>
    /// <returns>A paginated list of movie theaters.</returns>
    /// <response code="200">The list of movie theaters was successfully retrieved.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet]
    public async Task<ActionResult<List<MovieTheaterDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
    {
        var queryable = context.MovieTheaters.AsQueryable();
        await HttpContext.InsertParametersPaginationInHeader(queryable);
        var entities = await queryable.OrderBy(x => x.Name).Paginate(paginationDTO).ToListAsync();
        return mapper.Map<List<MovieTheaterDTO>>(entities);
    }

    /// <summary>
    /// Retrieves a movie theater by ID.
    /// </summary>
    /// <param name="id">The ID of the movie theater.</param>
    /// <returns>The movie theater with the specified ID.</returns>
    /// <response code="200">The movie theater was found and returned.</response>
    /// <response code="404">The movie theater with the specified ID was not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<MovieTheaterDTO>> Get(int id)
    {
        var movieTheater = await context.MovieTheaters.FirstOrDefaultAsync(x => x.Id == id);

        if (movieTheater == null)
        {
            return NotFound();
        }

        return mapper.Map<MovieTheaterDTO>(movieTheater);
    }

    /// <summary>
    /// Creates a new movie theater.
    /// </summary>
    /// <param name="movieCreationDTO">The data for the movie theater to be created.</param>
    /// <returns>A response with no content indicating the movie theater was successfully created.</returns>
    /// <response code="204">The movie theater was successfully created.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [HttpPost]
    public async Task<ActionResult> Post(MovieTheaterCreationDTO movieCreationDTO)
    {
        var movieTheater = mapper.Map<MovieTheater>(movieCreationDTO);
        context.Add(movieTheater);
        await context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Updates a movie theater.
    /// </summary>
    /// <param name="id">The ID of the movie theater to be updated.</param>
    /// <param name="movieCreationDTO">The updated data for the movie theater.</param>
    /// <returns>A response with no content indicating the movie theater was successfully updated.</returns>
    /// <response code="204">The movie theater was successfully updated.</response>
    /// <response code="404">If the movie theater with the specified ID was not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> Put(int id, MovieTheaterCreationDTO movieCreationDTO)
    {
        var movieTheater = await context.MovieTheaters.FirstOrDefaultAsync(x => x.Id == id);

        if (movieTheater == null)
        {
            return NotFound();
        }

        movieTheater = mapper.Map(movieCreationDTO, movieTheater);
        await context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Deletes a movie theater.
    /// </summary>
    /// <param name="id">The ID of the movie theater to be deleted.</param>
    /// <returns>A response with no content indicating the movie theater was successfully deleted.</returns>
    /// <response code="204">The movie theater was successfully deleted.</response>
    /// <response code="404">If the movie theater with the specified ID was not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var movieTheater = await context.MovieTheaters.AnyAsync(x => x.Id == id);

        if (!movieTheater)
        {
            return NotFound();
        }

        context.Remove(new MovieTheater() { Id = id });
        await context.SaveChangesAsync();
        return NoContent();
    }
}