using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.SeedData;

public class WebsitesSeedData
{
    public static async Task InitializeWebsites(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.GetRequiredService<IServiceProvider>().CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var websitesList = new List<Website>();

            websitesList.Add(new Website
            {
                Name = "Filma24",
                Link = "https://www.filma24.at/",
                Picture = "http://localhost:5156/websites/7a0994eb-f93a-4589-b460-843a7b0afd49.png"
            });
            websitesList.Add(new Website
            {
                Name = "Bflix",
                Link = "https://bflix.io/home",
                Picture = "http://localhost:5156/websites/ffb0e0f2-9f8d-4308-b15c-f20b76b608c3.png"
            });
            websitesList.Add(new Website
            {
                Name = "LOSmovies",
                Link = "https://losmovies.ru/home",
                Picture = "http://localhost:5156/websites/c732c873-f7c8-46c3-83c5-051dd67e428b.png"
            });

            foreach (var website in websitesList)
            {
                var exist = await context.Website.FirstOrDefaultAsync(x => x.Name == website.Name);

                if (exist == null)
                {
                    context.Website.Add(website);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}