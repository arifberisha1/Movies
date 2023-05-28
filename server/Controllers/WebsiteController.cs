using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/websites")]
public class WebsiteController: ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly IFileStorageService fileStorageService;
    private readonly IMapper mapper;
    private readonly string containerName = "websites";

    public WebsiteController(ApplicationDbContext context,
        IFileStorageService fileStorageService,
        IMapper mapper)
    {
        this.context = context;
        this.fileStorageService = fileStorageService;
        this.mapper = mapper;
    }

    /// <summary>
    /// Retrieves a list of websites with pagination.
    /// </summary>
    /// <param name="paginationDto">The pagination parameters.</param>
    /// <returns>A paginated list of websites.</returns>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<WebsiteDTO>))]
    [HttpGet]
    public async Task<ActionResult<List<WebsiteDTO>>> Get([FromQuery] PaginationDTO paginationDto)
    {
        var queryable = context.Website.AsQueryable();
        await HttpContext.InsertParametersPaginationInHeader(queryable);
        var websites = await queryable.OrderBy(x => x.Name).Paginate(paginationDto).ToListAsync();
        return mapper.Map<List<WebsiteDTO>>(websites);
    }

    /// <summary>
    /// Retrieves a specific website by ID.
    /// </summary>
    /// <param name="id">The ID of the website to retrieve.</param>
    /// <returns>The website with the specified ID.</returns>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WebsiteDTO))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<WebsiteDTO>> Get(int id)
    {
        var website = await context.Website.FirstOrDefaultAsync(x => x.Id == id);

        if (website == null)
        {
            return NotFound();
        }

        return mapper.Map<WebsiteDTO>(website);
    }

    /// <summary>
    /// Creates a new website.
    /// </summary>
    /// <param name="websiteCreationDto">The data for creating the website.</param>
    /// <returns>No content.</returns>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [HttpPost]
    public async Task<ActionResult> Post([FromForm] WebsiteCreationDTO websiteCreationDto)
    {
        var website = mapper.Map<Website>(websiteCreationDto);

        if (websiteCreationDto.Picture != null)
        {
            website.Picture = await fileStorageService.SaveFile(containerName, websiteCreationDto.Picture);
        }

        context.Add(website);
        await context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Updates a website.
    /// </summary>
    /// <param name="id">The ID of the website to update.</param>
    /// <param name="websiteCreationDto">The updated data for the website.</param>
    /// <returns>No content.</returns>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> Put(int id, [FromForm] WebsiteCreationDTO websiteCreationDto)
    {
        var website = await context.Website.FirstOrDefaultAsync(x => x.Id == id);

        if (website == null)
        {
            return NotFound();
        }

        website = mapper.Map(websiteCreationDto, website);

        if (website.Picture != null)
        {
            website.Picture = await fileStorageService.EditFile(containerName,
                websiteCreationDto.Picture, website.Picture);
        }

        await context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Deletes a website.
    /// </summary>
    /// <param name="id">The ID of the website to delete.</param>
    /// <returns>No content.</returns>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var website = await context.Website.FirstOrDefaultAsync(x => x.Id == id);

        if (website == null)
        {
            return NotFound();
        }

        context.Remove(website);
        await context.SaveChangesAsync();
        fileStorageService.DeleteFile(website.Picture, containerName);
        return NoContent();
    }
}