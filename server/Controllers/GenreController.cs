using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Controllers;

[Route("api/genres")]
[ApiController]
public class GenreController : ControllerBase
{

    private readonly ApplicationDbContext context;
    
    public GenreController(ApplicationDbContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Genre>>> Get()
    {
        return await context.Genres.ToListAsync();
    }

    [HttpGet("{Id:int}")]
    public ActionResult<Genre> Get(int id)
    {
        throw new NotImplementedException();
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] Genre genre)
    {
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