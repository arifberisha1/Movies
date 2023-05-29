using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.SeedData;

public class GenresSeedData
{
    public static async Task InitializeGenres(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.GetRequiredService<IServiceProvider>().CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var genreList = new List<Genre>();
            
            genreList.Add(new Genre {Name = "Action" });
            genreList.Add(new Genre {Name = "Comedy" });
            genreList.Add(new Genre {Name = "Adventure" });
            genreList.Add(new Genre {Name = "Fantasy" });
            genreList.Add(new Genre {Name = "Drama" });
            genreList.Add(new Genre {Name = "Romance" });
            genreList.Add(new Genre {Name = "Animation" });
            genreList.Add(new Genre {Name = "Sci-Fi" });

            foreach (var genre in genreList)
            {
                var exist = await context.Genres.FirstOrDefaultAsync(x => x.Name == genre.Name);

                if (exist == null)
                {
                    context.Genres.Add(genre);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}