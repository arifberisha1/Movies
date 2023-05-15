using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;
using server.Helpers;

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
    public async Task<ActionResult<List<GenreDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
    {
        var queryable = context.Genres.AsQueryable();
        await HttpContext.InertParametersPaginationInHeader(queryable);
        var genres =  await queryable.OrderBy(x => x.Name).Paginate(paginationDTO).ToListAsync();
        return mapper.Map<List<GenreDTO>>(genres);
    }

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

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] GenreCreationDTO genreCreationDTO)
    {
        var genre = mapper.Map<Genre>(genreCreationDTO);
        context.Add(genre);
        await context.SaveChangesAsync();
        return NoContent();
    }

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

    [HttpDelete("{id:int")]
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