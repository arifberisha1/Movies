using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using server.Entities;

namespace server.SeedData;

public class MovieTheatersSeedData
{
    public static async Task InitializeMovieTheaters(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.GetRequiredService<IServiceProvider>().CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var hasMovieTheaters = await context.MovieTheaters.ToListAsync();

            if (hasMovieTheaters.Count == 0)
            {
                var movieThaterList = new List<MovieTheater>();

                movieThaterList.Add(new MovieTheater
                {
                    Name = "Cineplexx",
                    Location = new Point(21.151874, 42.632798) { SRID = 4326 },
                    Link = "https://www.cineplexx-ks.eu/"
                });
                movieThaterList.Add(new MovieTheater
                {
                    Name = "CineStart",
                    Location = new Point(21.133257, 42.564453) { SRID = 4326 },
                    Link = "https://www.cinestarcinemas-ks.eu/"
                });

                foreach (var movieTheater in movieThaterList)
                {
                    var exist = await context.MovieTheaters.FirstOrDefaultAsync(x => x.Name == movieTheater.Name);

                    if (exist == null)
                    {
                        context.MovieTheaters.Add(movieTheater);
                    }
                }

                await context.SaveChangesAsync();
            }
        }
    }
}