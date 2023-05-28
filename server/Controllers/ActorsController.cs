using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;
using server.Helpers;

namespace server.Controllers;

[Route("api/actors")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
public class ActorsController : ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;
    private readonly IFileStorageService fileStorageService;
    private readonly string containerName = "actors";

    public ActorsController(ApplicationDbContext context, IMapper mapper, IFileStorageService fileStorageService)
    {
        this.context = context;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }

    /// <summary>
    /// Retrieves a paginated list of actors.
    /// </summary>
    /// <param name="paginationDto">Pagination information.</param>
    /// <returns>A paginated list of actor DTOs.</returns>
    /// <response code="200">Returns a paginated list of actor DTOs.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ActorDTO>))]
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ActorDTO>>> Get([FromQuery] PaginationDTO paginationDto)
    {
        var queryable = context.Actors.AsQueryable();
        await HttpContext.InsertParametersPaginationInHeader(queryable);
        var actors = await queryable.OrderBy(x => x.Name).Paginate(paginationDto).ToListAsync();
        return mapper.Map<List<ActorDTO>>(actors);
    }

    /// <summary>
    /// Retrieves typeahead suggestions for actors.
    /// </summary>
    /// <returns>A list of typeahead DTOs for actors.</returns>
    /// <response code="200">Returns a list of typeahead DTOs for actors.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ActorsTypeaheadDTO>))]
    [HttpGet("typeahead")]
    [AllowAnonymous]
    public async Task<ActionResult<List<ActorsTypeaheadDTO>>> GetTypeahead()
    {
        List<ActorsTypeaheadDTO> typeaheadList = new List<ActorsTypeaheadDTO>();

        var actors = await context.Actors.OrderBy(x => x.Name).ToListAsync();

        if (actors == null)
        {
            return typeaheadList;
        }

        foreach (var actor in actors)
        {
            var typeahead = new ActorsTypeaheadDTO()
            {
                Id = actor.Id,
                Name = actor.Name,
                Picture = actor.Picture
            };

            typeaheadList.Add(typeahead);
        }

        return typeaheadList;
    }

    /// <summary>
    /// Retrieves an actor by ID.
    /// </summary>
    /// <param name="id">The ID of the actor.</param>
    /// <returns>The actor DTO with the specified ID.</returns>
    /// <response code="200">Returns the actor DTO with the specified ID.</response>
    /// <response code="404">If the actor with the specified ID is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ActorDTO))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ActorDTO>> Get(int id)
    {
        var actor = await context.Actors.FirstOrDefaultAsync(x => x.Id == id);

        if (actor == null)
        {
            return NotFound();
        }

        return mapper.Map<ActorDTO>(actor);
    }

    /// <summary>
    /// Searches for actors by name.
    /// </summary>
    /// <param name="query">The search query for actor names.</param>
    /// <returns>A list of actor movie DTOs matching the search query.</returns>
    /// <response code="200">Returns a list of actor movie DTOs matching the search query.</response>
    [HttpGet("searchByName/{query}")]
    public async Task<ActionResult<List<ActorsMovieDTO>>> SearchByName(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<ActorsMovieDTO>();
        }

        return await context.Actors
            .Where(x => x.Name.Contains(query))
            .OrderBy(x => x.Name)
            .Select(x => new ActorsMovieDTO { Id = x.Id, Name = x.Name, Picture = x.Picture })
            .Take(5)
            .ToListAsync();
    }

    /// <summary>
    /// Creates a new actor.
    /// </summary>
    /// <param name="actorCreationDto">The data for creating the actor.</param>
    /// <returns>No content.</returns>
    /// <response code="204">Indicates that the actor was created successfully.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [HttpPost]
    public async Task<ActionResult> Post([FromForm] ActorCreationDTO actorCreationDto)
    {
        var actor = mapper.Map<Actor>(actorCreationDto);

        if (actorCreationDto.Picture != null)
        {
            actor.Picture = await fileStorageService.SaveFile(containerName, actorCreationDto.Picture);
        }

        context.Add(actor);
        await context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Updates an existing actor.
    /// </summary>
    /// <param name="id">The ID of the actor to update.</param>
    /// <param name="actorCreationDto">The data for updating the actor.</param>
    /// <returns>No content.</returns>
    /// <response code="204">Indicates that the actor was updated successfully.</response>
    /// <response code="404">If the actor with the specified ID is not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> Put(int id, [FromForm] ActorCreationDTO actorCreationDto)
    {
        var actor = await context.Actors.FirstOrDefaultAsync(x => x.Id == id);

        if (actor == null)
        {
            return NotFound();
        }

        actor = mapper.Map(actorCreationDto, actor);

        if (actorCreationDto.Picture != null)
        {
            actor.Picture = await fileStorageService.EditFile(containerName,
                actorCreationDto.Picture,
                actor.Picture);
        }

        await context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Deletes an actor.
    /// </summary>
    /// <param name="id">The ID of the actor to delete.</param>
    /// <returns>No content.</returns>
    /// <response code="204">Indicates that the actor was deleted successfully.</response>
    /// <response code="404">If the actor with the specified ID is not found.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var actor = await context.Actors.FirstOrDefaultAsync(x => x.Id == id);

        if (actor == null)
        {
            return NotFound();
        }

        context.Remove(actor);
        await context.SaveChangesAsync();
        await fileStorageService.DeleteFile(actor.Picture, containerName);
        return NoContent();
    }
}