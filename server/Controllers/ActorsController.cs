﻿using AutoMapper;
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


    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ActorDTO>>> Get([FromQuery] PaginationDTO paginationDto)
    {
        var queryable = context.Actors.AsQueryable();
        await HttpContext.InsertParametersPaginationInHeader(queryable);
        var actors = await queryable.OrderBy(x => x.Name).Paginate(paginationDto).ToListAsync();
        return mapper.Map<List<ActorDTO>>(actors);
    }

    [HttpGet("typeahead")]
    [AllowAnonymous]
    public async Task<ActionResult<List<typeaheadDTO>>> GetTypeahead()
    {
        List<typeaheadDTO> typeaheadList = new List<typeaheadDTO>();

        var actors = await context.Actors.ToListAsync();

        if (actors == null)
        {
            return typeaheadList;
        }

        foreach (var actor in actors)
        {
            var typeahead = new typeaheadDTO()
            {
                Id = actor.Id,
                Name = actor.Name,
                Picture = actor.Picture
            };

            typeaheadList.Add(typeahead);
        }

        return typeaheadList;
    }


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