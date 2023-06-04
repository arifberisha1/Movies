using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.DTOs;
using server.Entities;
using server.Helpers;

namespace server.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController : ControllerBase
{
    private readonly UserManager<IdentityUser> userManager;
    private readonly SignInManager<IdentityUser> signInManager;
    private readonly IConfiguration configuration;
    private readonly ApplicationDbContext context;
    private readonly IMapper mapper;

    public AccountsController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        IConfiguration configuration, ApplicationDbContext context,
        IMapper mapper)
    {
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.configuration = configuration;
        this.context = context;
        this.mapper = mapper;
    }

    /// <summary>
    /// Retrieves a list of users with pagination.
    /// </summary>
    /// <remarks>
    /// This endpoint requires the user to be authenticated with the 'IsAdmin' role.
    /// </remarks>
    /// <param name="paginationDto">Pagination information.</param>
    /// <returns>A list of user DTOs.</returns>
    /// <response code="200">Returns the list of users.</response>
    /// <response code="401">If the user is not authenticated.</response>
    /// <response code="403">If the user is not authorized.</response>
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserDTO>))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpGet("listUsers")]
    public async Task<ActionResult<List<UserDTO>>> GetListUsers([FromQuery] PaginationDTO paginationDto)
    {
        var queryable = context.Users.AsQueryable();
        await HttpContext.InsertParametersPaginationInHeader(queryable);
        var users = await queryable.OrderBy(x => x.Email).Paginate(paginationDto).ToListAsync();
        return mapper.Map<List<UserDTO>>(users);
    }

    /// <summary>
    /// Retrieves a user by email.
    /// </summary>
    /// <param name="email">The email of the user to retrieve.</param>
    /// <returns>The user details.</returns>
    /// <response code="200">Returns the user details.</response>
    /// <response code="404">If the user is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDetailsDTO))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("getByEmail")]
    public async Task<ActionResult<UserDetailsDTO>> GetByEmail([FromQuery] string email)
    {
        var user = await context.UserDetails.FirstOrDefaultAsync(x => x.Email == email);

        if (user == null)
        {
            return NotFound();
        }

        var userDetailsDto = new UserDetailsDTO()
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Birthday = user.Birthday,
            Gender = user.Gender,
            Address = user.Address,
            Email = user.Email
        };

        return userDetailsDto;
    }

    /// <summary>
    /// Retrieves a list of admin emails.
    /// </summary>
    /// <returns>A list of admin emails.</returns>
    /// <response code="200">Returns the list of admin emails.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<string>))]
    [HttpGet("getAdmins")]
    public async Task<ActionResult<List<string>>> GetAdmins()
    {
        List<string> adminEmails = new List<string>();
        var claims = await context.UserClaims.Where(x => x.ClaimValue == "admin").ToListAsync();
        foreach (var claim in claims)
        {
            adminEmails.Add(claim.UserId);
        }

        return adminEmails;
    }

    /// <summary>
    /// Makes a user an admin.
    /// </summary>
    /// <remarks>
    /// This endpoint requires the user to be authenticated with the 'IsAdmin' role.
    /// </remarks>
    /// <param name="userId">The ID of the user to make admin.</param>
    /// <returns>No content.</returns>
    /// <response code="204">Indicates success.</response>
    /// <response code="401">If the user is not authenticated.</response>
    /// <response code="403">If the user is not authorized.</response>
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost("makeAdmin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public async Task<ActionResult> MakeAdmin([FromBody] string userId)
    {
        var user = await userManager.FindByIdAsync(userId);
        await userManager.AddClaimAsync(user, new Claim("role", "admin"));
        return NoContent();
    }

    /// <summary>
    /// Removes admin role from a user.
    /// </summary>
    /// <remarks>
    /// This endpoint requires the user to be authenticated with the 'IsAdmin' role.
    /// </remarks>
    /// <param name="userId">The ID of the user to remove admin role from.</param>
    /// <returns>No content.</returns>
    /// <response code="204">Indicates success.</response>
    /// <response code="401">If the user is not authenticated.</response>
    /// <response code="403">If the user is not authorized.</response>
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost("removeAdmin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public async Task<ActionResult> RemoveAdmin([FromBody] string userId)
    {
        var user = await userManager.FindByIdAsync(userId);
        await userManager.RemoveClaimAsync(user, new Claim("role", "admin"));
        return NoContent();
    }

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="userCreation">User creation information.</param>
    /// <returns>An authentication response.</returns>
    /// <response code="200">Returns an authentication response with a token.</response>
    /// <response code="400">If the user creation fails.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AuthenticationResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpPost("create")]
    public async Task<ActionResult<AuthenticationResponse>> Create(
        [FromBody] UserCreation userCreation)
    {
        UserCredentials userCredentials = new UserCredentials()
        {
            Email = userCreation.Email,
            Password = userCreation.Password
        };
        var userDetails = new UserDetails()
        {
            Name = userCreation.Name,
            Surname = userCreation.Surname,
            Birthday = userCreation.Birthday,
            Gender = userCreation.Gender,
            Address = userCreation.Address,
            Email = userCreation.Email
        };

        var user = new IdentityUser { UserName = userCredentials.Email, Email = userCredentials.Email };
        var result = await userManager.CreateAsync(user, userCredentials.Password);

        if (result.Succeeded)
        {
            context.UserDetails.Add(userDetails);
            await context.SaveChangesAsync();

            return BuildToken(userCredentials, false);
        }
        else
        {
            return BadRequest(result.Errors);
        }
    }

    /// <summary>
    /// Edits user details.
    /// </summary>
    /// <param name="userEditDto">The user details to edit.</param>
    /// <returns>An action result indicating the success of the operation.</returns>
    /// <response code="200">Indicates that the user details were edited successfully.</response>
    /// <response code="404">If the user is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpPost("editUser")]
    public async Task<ActionResult> EditUser([FromBody] UserEditDTO userEditDto)
    {
        var user = await context.UserDetails.FirstOrDefaultAsync(x => x.Email == userEditDto.Email);

        if (user == null)
        {
            return NotFound();
        }

        user.Name = userEditDto.Name;
        user.Surname = userEditDto.Surname;
        user.Birthday = userEditDto.Birthday;
        user.Gender = userEditDto.Gender;
        user.Address = userEditDto.Address;

        await context.SaveChangesAsync();

        return Ok("User details edited successfully");
    }

    /// <summary>
    /// Authenticates a user and generates a token.
    /// </summary>
    /// <param name="userCredentials">User credentials.</param>
    /// <returns>An authentication response with a token.</returns>
    /// <response code="200">Returns an authentication response with a token if the login is successful.</response>
    /// <response code="400">If the login fails.</response>
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AuthenticationResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpPost("login")]
    public async Task<ActionResult<AuthenticationResponse>> Login(
        [FromBody] UserCredentials userCredentials)
    {
        var result = await signInManager.PasswordSignInAsync(userCredentials.Email,
            userCredentials.Password, isPersistent: false, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            return BuildToken(userCredentials, true);
        }
        else
        {
            return BadRequest("Incorrect Login");
        }
    }

    /// <summary>
    /// Changes the password for a user.
    /// </summary>
    /// <param name="changePasswordDto">The change password information.</param>
    /// <returns>An action result indicating the success of the operation.</returns>
    /// <response code="200">Indicates that the password was changed successfully.</response>
    /// <response code="400">If the old password is incorrect or the change password operation fails.</response>
    /// <response code="404">If the user is not found.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpPut("changePassword")]
    public async Task<ActionResult> ChangePassword([FromBody] changePasswordDTO changePasswordDto)
    {
        var user = await userManager.FindByEmailAsync(changePasswordDto.Email);

        if (user == null)
        {
            return NotFound();
        }

        var passwordValid = await userManager.CheckPasswordAsync(user, changePasswordDto.OldPassword);

        if (!passwordValid)
        {
            return BadRequest("Incorrect Old Password!");
        }

        var changePasswordResult =
            await userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);

        if (changePasswordResult.Succeeded)
        {
            return Ok("Password changed successfully");
        }
        else
        {
            return BadRequest(changePasswordResult.Errors);
        }
    }

    private AuthenticationResponse BuildToken(UserCredentials userCredentials, bool checkAdmin)
    {
        var claims = new List<Claim>()
        {
            new Claim("email", userCredentials.Email)
        };

        if (checkAdmin)
        {
            if (isAdmin(userCredentials.Email))
            {
                var claim = new Claim("role", "admin");
                claims.Add(claim);
            }
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["keyjwt"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiration = DateTime.UtcNow.AddYears(1);

        var token = new JwtSecurityToken(issuer: null, audience: null, claims: claims,
            expires: expiration, signingCredentials: creds);

        return new AuthenticationResponse()
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = expiration
        };
    }

    private bool isAdmin(string email)
    {
        var user = context.Users.FirstOrDefault(x => x.Email == email);
        var DbClaim = context.UserClaims.FirstOrDefault(x =>
            x.UserId == user.Id);
        var DbRole = DbClaim?.ClaimValue;

        if (DbRole == "admin" && DbRole != null)
        {
            return true;
        }

        return false;
    }
}