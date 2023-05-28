using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;
using server.Helpers;

namespace server.Controllers;

[Route("api/genres")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
public class GenreController : ControllerBase
{

    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;

    public GenreController(ApplicationDbContext context, IMapper mapper)
    {
        this.context = context;
        this.mapper = mapper;
    }

    /// <summary>
    /// Retrieves genres with pagination.
    /// </summary>
    /// <param name="paginationDTO">The pagination parameters.</param>
    /// <returns>A list of genres.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet]
    public async Task<ActionResult<List<GenreDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
    {
        var queryable = context.Genres.AsQueryable();
        await HttpContext.InsertParametersPaginationInHeader(queryable);
        var genres =  await queryable.OrderBy(x => x.Name).Paginate(paginationDTO).ToListAsync();
        return mapper.Map<List<GenreDTO>>(genres);
    }
    
    /// <summary>
    /// Retrieves all genres.
    /// </summary>
    /// <returns>A list of genres.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<ActionResult<List<GenreDTO>>> Get()
    {
        var genres =  await context.Genres.OrderBy(x => x.Name).ToListAsync();
        return mapper.Map<List<GenreDTO>>(genres);
    }

    /// <summary>
    /// Retrieves a genre by its ID.
    /// </summary>
    /// <param name="Id">The ID of the genre to retrieve.</param>
    /// <returns>The genre with the specified ID.</returns>
    /// <response code="200">The genre was found and returned.</response>
    /// <response code="404">The genre with the specified ID was not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{Id:int}")]
    public async Task<ActionResult<GenreDTO>> Get(int Id)
    {
        var genre = await context.Genres.FirstOrDefaultAsync(x => x.Id == Id);

        if (genre == null)
        {
            return NotFound();
        }

        return mapper.Map<GenreDTO>(genre);

    }

    /// <summary>
    /// Creates a new genre.
    /// </summary>
    /// <param name="genreCreationDTO">The data for the new genre.</param>
    /// <returns>A response indicating the result of the operation.</returns>
    /// <response code="204">The genre was created successfully.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [HttpPost]
    public async Task<ActionResult> Post([FromBody] GenreCreationDTO genreCreationDTO)
    {
        var genre = mapper.Map<Genre>(genreCreationDTO);
        context.Add(genre);
        await context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Updates an existing genre.
    /// </summary>
    /// <param name="id">The ID of the genre to update.</param>
    /// <param name="genreCreationDto">The updated data for the genre.</param>
    /// <returns>A response indicating the result of the operation.</returns>
    /// <response code="204">The genre was updated successfully.</response>
    /// <response code="404">The genre with the specified ID was not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> Put(int id, [FromBody] GenreCreationDTO genreCreationDto)
    {
        var genre = await context.Genres.FirstOrDefaultAsync(x => x.Id == id);

        if (genre == null)
        {
            return NotFound();
        }

        genre = mapper.Map(genreCreationDto, genre);
        await context.SaveChangesAsync();
        return NoContent();

    }

    /// <summary>
    /// Deletes a genre.
    /// </summary>
    /// <param name="id">The ID of the genre to delete.</param>
    /// <returns>A response indicating the result of the operation.</returns>
    /// <response code="204">The genre was deleted successfully.</response>
    /// <response code="404">The genre with the specified ID was not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var exists = await context.Genres.AnyAsync(x => x.Id == id);

        if (!exists)
        {
            return NotFound();
        }

        context.Remove(new Genre() { Id = id });
        await context.SaveChangesAsync();
        return NoContent();
    }
}