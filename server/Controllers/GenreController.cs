using Microsoft.AspNetCore.Mvc;
using server.Entities;

namespace server.Controllers;

[Route("api/genres")]
[ApiController]
public class GenreController : ControllerBase
{
    public GenreController()
    {
    }

    [HttpGet]
    public async Task<ActionResult<List<Genre>>> Get()
    {
        return new List<Genre>() { new Genre() { Id = 1, Name = "Comedy" } };
    }

    [HttpGet("{Id:int}")]
    public ActionResult<Genre> Get(int id)
    {
        throw new NotImplementedException();
    }

    [HttpPost]
    public ActionResult Post([FromBody] Genre genre)
    {
        throw new NotImplementedException();
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