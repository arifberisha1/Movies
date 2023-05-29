using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.SeedData;

public class AdminSeedData
{
    public static async Task InitializeAdminUser(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var adminEmail = "admin@admin.com";
                var adminExists = await userManager.FindByEmailAsync(adminEmail);
                if (adminExists == null)
                {
                    var adminUser = new IdentityUser
                    {
                        UserName = adminEmail,
                        Email = adminEmail
                    };

                    var result = await userManager.CreateAsync(adminUser, "Admin123.");
                    if (result.Succeeded)
                    {
                        var hasAdminClaim = await userManager.GetClaimsAsync(adminUser);
                        var adminClaimExists = hasAdminClaim.Any(c => c.Type == "role" && c.Value == "admin");
                        if (!adminClaimExists)
                        {
                            await userManager.AddClaimAsync(adminUser, new Claim("role", "admin"));
                        }

                        var hasDetails = await context.UserDetails.FirstOrDefaultAsync(x => x.Email == adminEmail);
                        if (hasDetails == null)
                        {
                            var userDetail = new UserDetails()
                            {
                                Name = "admin",
                                Surname = "admin",
                                Birthday = new DateTime(2002, 8, 24),
                                Gender = "Undefined",
                                Address = "Undefined",
                                Email = adminEmail
                            };

                            context.UserDetails.Add(userDetail);
                            await context.SaveChangesAsync();
                        }
                    }
                }
            }
        }
}