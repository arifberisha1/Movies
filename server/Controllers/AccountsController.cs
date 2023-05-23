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

    [HttpGet("listUsers")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public async Task<ActionResult<List<UserDTO>>> GetListUsers([FromQuery] PaginationDTO paginationDto)
    {
        var queryable = context.Users.AsQueryable();
        await HttpContext.InsertParametersPaginationInHeader(queryable);
        var users = await queryable.OrderBy(x => x.Email).Paginate(paginationDto).ToListAsync();
        return mapper.Map<List<UserDTO>>(users);
    }

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

    [HttpPost("makeAdmin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public async Task<ActionResult> MakeAdmin([FromBody] string userId)
    {
        var user = await userManager.FindByIdAsync(userId);
        await userManager.AddClaimAsync(user, new Claim("role", "admin"));
        return NoContent();
    }

    [HttpPost("removeAdmin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public async Task<ActionResult> RemoveAdmin([FromBody] string userId)
    {
        var user = await userManager.FindByIdAsync(userId);
        await userManager.RemoveClaimAsync(user, new Claim("role", "admin"));
        return NoContent();
    }

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

        var changePasswordResult = await userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);

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