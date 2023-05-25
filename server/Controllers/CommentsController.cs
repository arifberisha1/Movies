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

    [HttpGet("getByMovieId/{id:int}")]
    public async Task<ActionResult<List<CommentDTO>>> GetByMovieId(int id)
    {
        var commentsList = new List<CommentDTO>();
        var comments = await context.Comment.Where(x => x.MovieId == id).ToListAsync();

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
}