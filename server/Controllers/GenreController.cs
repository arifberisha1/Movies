using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;

namespace server.Controllers;

[Route("api/genres")]
[ApiController]
public class GenreController : ControllerBase
{

    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;

    public GenreController(ApplicationDbContext context, IMapper mapper)
    {
        this.context = context;
        this.mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<GenreDTO>>> Get()
    {
       
        var genres =  await context.Genres.ToListAsync();
        return mapper.Map<List<GenreDTO>>(genres);
    }

    [HttpGet("{Id:int}")]
    public ActionResult<Genre> Get(int id)
    {
        throw new NotImplementedException();
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] GenreCreationDTO genreCreationDTO)
    {
        var genre = mapper.Map<Genre>(genreCreationDTO);
        context.Add(genre);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut]
    public ActionResult Put([FromBody] Genre genre)
    {
        throw new NotImplementedException();
    }

    [HttpDelete]
    public ActionResult Delete()
    {
        throw new NotImplementedException();
    }
}