using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;

namespace server.Controllers;

[ApiController]
[Route("api/comments")]
public class CommentsController : ControllerBase
{
    private readonly ApplicationDbContext context;

    public CommentsController(ApplicationDbContext context)
    {
        this.context = context;
    }

    /// <summary>
    /// Retrieves comments by movie ID.
    /// </summary>
    /// <param name="id">The ID of the movie.</param>
    /// <returns>The list of comments for the specified movie.</returns>
    /// <response code="200">The list of comments for the specified movie.</response>
    /// <response code="400">If there are no comments for the specified movie.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<CommentDTO>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpGet("getByMovieId/{id:int}")]
    public async Task<ActionResult<List<CommentDTO>>> GetByMovieId(int id)
    {
        var commentsList = new List<CommentDTO>();
        var comments = await context.Comment
            .Where(x => x.MovieId == id).OrderByDescending(x => x.Id).ToListAsync();

        if (comments.Count == 0) // Check if the comments list is empty
        {
            return BadRequest("There are no comments for this movie");
        }

        foreach (var comment in comments)
        {
            var user = await context.UserDetails.FirstOrDefaultAsync(x => x.Email == comment.UserEmail);

            var commentDto = new CommentDTO()
            {
                Id = comment.Id,
                UserComment = comment.UserComment,
                UserEmail = comment.UserEmail,
                MovieId = comment.MovieId,
                Name = user.Name,
                Surname = user.Surname
            };

            commentsList.Add(commentDto);
        }

        return commentsList;
    }

    /// <summary>
    /// Creates a new comment.
    /// </summary>
    /// <param name="commentCreationDto">The data for creating the comment.</param>
    /// <returns>A response indicating the result of the comment creation.</returns>
    /// <response code="200">Indicates that the comment was created successfully.</response>
    /// <response code="400">If the comment data is invalid or the comment creation fails.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpPost("create")]
    public async Task<ActionResult> Create([FromBody] CommentCreationDTO commentCreationDto)
    {
        if (commentCreationDto == null)
        {
            return BadRequest();
        }

        var comment = new Comment()
        {
            UserComment = commentCreationDto.UserComment,
            UserEmail = commentCreationDto.UserEmail,
            MovieId = commentCreationDto.MovieId
        };
        
        try
        {
            await context.Comment.AddAsync(comment);
            await context.SaveChangesAsync();
            return Ok("Comment saved successfully!");
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }
    
    /// <summary>
    /// Deletes a comment by its ID.
    /// </summary>
    /// <param name="id">The ID of the comment to delete.</param>
    /// <returns>A response indicating the result of the comment deletion.</returns>
    /// <response code="200">Indicates that the comment was deleted successfully.</response>
    /// <response code="404">If the comment with the specified ID is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpDelete("delete/{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var exists = await context.Comment.AnyAsync(x => x.Id == id);

        if (!exists)
        {
            return NotFound();
        }

        context.Remove(new Comment() { Id = id });
        await context.SaveChangesAsync();
        return Ok("Comment deleted successfully!");
    }
}