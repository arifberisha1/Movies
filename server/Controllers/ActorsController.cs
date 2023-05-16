using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;
using server.Helpers;

namespace server.Controllers;

[Route("api/actors")]
[ApiController]
public class ActorsController: ControllerBase
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


    [HttpGet]
    public async Task<ActionResult<List<ActorDTO>>> Get()
    {
        var actors = await context.Actors.ToListAsync();
        return mapper.Map<List<ActorDTO>>(actors);
    }


    [HttpGet("{id:int}")]
    public async Task<ActionResult<ActorDTO>> Get(int id)
    {
        var actor = await context.Actors.FirstOrDefaultAsync(x => x.Id == id);

        if (actor == null)
        {
            return NotFound();
        }

        return mapper.Map<ActorDTO>(actor);
    }

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

    [HttpPut]
    public async Task<ActionResult> Put([FromForm] ActorCreationDTO actorCreationDto)
    {
        throw new NotImplementedException();
    }

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
        return NoContent(); 

    }

}