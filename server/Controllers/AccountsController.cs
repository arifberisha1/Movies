using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.DTOs;

namespace server.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController: ControllerBase
{
    private readonly UserManager<IdentityUser> userManager;
    private readonly SignInManager<IdentityUser> signInManager;
    private readonly IConfiguration configuration;
    private readonly ApplicationDbContext context;

    public AccountsController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        IConfiguration configuration, ApplicationDbContext context)
    {
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.configuration = configuration;
        this.context = context;
    }

    [HttpPost("create")]
    public async Task<ActionResult<AuthenticationResponse>> Create(
        [FromBody] UserCredentials userCredentials)
    {
        var user = new IdentityUser { UserName = userCredentials.Email, Email = userCredentials.Email };
        var result = await userManager.CreateAsync(user, userCredentials.Password);

        if (result.Succeeded)
        {
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