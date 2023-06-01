using Microsoft.AspNetCore.Mvc;

namespace server.Controllers;

[ApiController]
[Route("api/server")]
public class ServerController : ControllerBase
{
    /// <summary>
    /// Checks if the server is running.
    /// </summary>
    /// <returns>Returns 200 OK if the server is running.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("running")]
    public async Task<ActionResult> running()
    {
        return Ok();
    }
}