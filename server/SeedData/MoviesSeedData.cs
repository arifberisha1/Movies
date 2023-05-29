using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.SeedData;

public class MoviesSeedData
{
    public static async Task InitializeMovies(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.GetRequiredService<IServiceProvider>().CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Adding movies

            var moviesList = new List<Movie>
            {
                new Movie
                {
                    Title = "Game Of Thrones",
                    Summary =
                        "George R.R. Martin's best-selling book series \"A Song of Ice and Fire\" is brought to the screen as HBO sinks its considerable storytelling teeth into the medieval fantasy epic. It's the depiction of two powerful families -- kings and queens, knights and renegades, liars and honest men -- playing a deadly game for control of the Seven Kingdoms of Westeros, and to sit atop the Iron Throne. Martin is credited as a co-executive producer and one of the writers for the series, whose shooting locations include Northern Ireland, Malta, Croatia and Spain.",
                    Trailer = "https://www.youtube.com/watch?v=KPLWWIOCOOQ&pp=ygUXZ2FtZSBvZiB0aHJvbmVzIHRyYWlsZXI%3D",
                    InTheaters = true,
                    ReleaseDate = new DateTime(2019, 4, 14),
                    Poster = "http://localhost:5156/movies/ec9743d2-23fa-4a9c-81e8-99283759d7c3.png"
                },
                new Movie
                {
                    Title = "John Wick 4",
                    Summary =
                        "With the price on his head ever increasing, legendary hit man John Wick takes his fight against the High Table global as he seeks out the most powerful players in the underworld, from New York to Paris to Japan to Berlin.",
                    Trailer = "https://www.youtube.com/watch?v=qEVUtrk8_B4&pp=ygUTam9obiB3aWNrIDQgdHJhaWxlcg%3D%3D",
                    InTheaters = false,
                    ReleaseDate = new DateTime(2023, 7, 14),
                    Poster = "http://localhost:5156/movies/d47070f9-006b-42f2-9efb-12a8d1f1e591.jpeg"
                },
                new Movie
                {
                    Title = "Jumanji: Welcome to the Jungle",
                    Summary =
                        "Four high school kids discover an old video game console and are drawn into the game's jungle setting, literally becoming the adult avatars they chose. What they discover is that you don't just play Jumanji - you must survive it. To beat the game and return to the real world, they'll have to go on the most dangerous adventure of their lives, discover what Alan Parrish left 20 years ago, and change the way they think about themselves - or they'll be stuck in the game forever.",
                    Trailer = "https://www.youtube.com/watch?v=2QKg5SZ_35I&pp=ygUPanVtYW5qaSB0cmFpbGVy",
                    InTheaters = true,
                    ReleaseDate = new DateTime(2017, 12, 20),
                    Poster = "http://localhost:5156/movies/c7a91606-4cbe-4b33-80c2-e0e054698315.jpeg"
                },
                new Movie
                {
                    Title = "Aquaman 2",
                    Summary =
                        "Aquaman forges an uneasy alliance with an unlikely ally in a bid to save Atlantis and the rest of the planet.",
                    Trailer = "https://www.youtube.com/watch?v=nA7-qKCg3B8&pp=ygURYXF1YW1hbiAyIHRyYWlsZXI%3D",
                    InTheaters = false,
                    ReleaseDate = new DateTime(2023, 12, 20),
                    Poster = "http://localhost:5156/movies/2784aa9f-c981-4942-a205-af0a27f66f9e.jpeg"
                },
                new Movie
                {
                    Title = "Pirates of the Caribbean 5",
                    Summary =
                        "Thrust into an all-new adventure, a down-on-his-luck Capt. Jack Sparrow feels the winds of ill-fortune blowing even more strongly when deadly ghost sailors led by his old nemesis, the evil Capt. Salazar, escape from the Devil's Triangle. Jack's only hope of survival lies in seeking out the legendary Trident of Poseidon, but to find it, he must forge an uneasy alliance with a brilliant and beautiful astronomer and a headstrong young man in the British navy.",
                    Trailer =
                        "https://www.youtube.com/watch?v=Hgeu5rhoxxY&pp=ygUicGlyYXRlcyBvZiB0aGUgY2FyaWJiZWFuIDUgdHJhaWxlcg%3D%3D",
                    InTheaters = true,
                    ReleaseDate = new DateTime(2017, 5, 26),
                    Poster = "http://localhost:5156/movies/50701095-e347-42a1-a50d-01957b6b9457.jpeg"
                },
                new Movie
                {
                    Title = "Ghosted",
                    Summary =
                        "Cole falls head over heels for enigmatic Sadie, but then makes the shocking discovery that she's a secret agent. Before they can decide on a second date, Cole and Sadie are swept away on an international adventure to save the world.",
                    Trailer = "https://www.youtube.com/watch?v=IAdCsNtEuBU&pp=ygUPZ2hvc3RlZCB0cmFpbGVy",
                    InTheaters = false,
                    ReleaseDate = new DateTime(2023, 8, 6),
                    Poster = "http://localhost:5156/movies/8c14b9ae-b875-4362-995c-7212feea0085.jpeg"
                },
                new Movie
                {
                    Title = "Fast X",
                    Summary =
                        "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted and outdriven every foe in their path. Now, they must confront the most lethal opponent they've ever faced. Fueled by revenge, a terrifying threat emerges from the shadows of the past to shatter Dom's world and destroy everything -- and everyone -- he loves.",
                    Trailer = "https://www.youtube.com/watch?v=aOb15GVFZxU&pp=ygUOZmFzdCB4IHRyYWlsZXI%3D",
                    InTheaters = false,
                    ReleaseDate = new DateTime(2023, 8, 12),
                    Poster = "http://localhost:5156/movies/07e383ad-21ff-4f9c-8ec1-a817ba8e7308.jpg"
                },
                new Movie
                {
                    Title = "Avatar 2",
                    Summary =
                        "Jake Sully and Ney'tiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora. When an ancient threat resurfaces, Jake must fight a difficult war against the humans.",
                    Trailer = "https://www.youtube.com/watch?v=d9MyW72ELq0&pp=ygUQYXZhdGFyIDIgdHJhaWxlcg%3D%3D",
                    InTheaters = false,
                    ReleaseDate = new DateTime(2023, 8, 10),
                    Poster = "http://localhost:5156/movies/49d1a158-c8b6-4943-8055-20ad97ca317f.jpg"
                },
                new Movie
                {
                    Title = "The Hunger Games",
                    Summary =
                        "Realizing the stakes are no longer just for survival, Katniss Everdeen (Jennifer Lawrence) teams up with her closest friends, including Peeta (Josh Hutcherson), Gale (Liam Hemsworth) and Finnick for the ultimate mission. Together, they leave District 13 to liberate the citizens of war-torn Panem and assassinate President Snow, who's obsessed with destroying Katniss. What lies ahead are mortal traps, dangerous enemies and moral choices that will ultimately determine the future of millions.",
                    Trailer =
                        "https://www.youtube.com/watch?v=KmYNkasYthg&pp=ygUudGhlIGh1bmdlciBnYW1lcyBtb2NraW5namF5IOKAkyBwYXJ0IDIgdHJhaWxlcg%3D%3D",
                    InTheaters = true,
                    ReleaseDate = new DateTime(2015, 11, 20),
                    Poster = "http://localhost:5156/movies/0a35f32d-8cf4-4e90-ad37-f125a1c1463c.jpeg"
                },
                new Movie
                {
                    Title = "Alice In Wonderland",
                    Summary =
                        "A young girl when she first visited magical Underland, Alice Kingsleigh (Mia Wasikowska) is now a teenager with no memory of the place -- except in her dreams. Her life takes a turn for the unexpected when, at a garden party for her fiance and herself, she spots a certain white rabbit and tumbles down a hole after him. Reunited with her friends the Mad Hatter (Johnny Depp), the Cheshire Cat and others, Alice learns it is her destiny to end the Red Queen's (Helena Bonham Carter) reign of terror.",
                    Trailer = "https://www.youtube.com/watch?v=9POCgSRVvf0&pp=ygUbYWxpY2UgaW4gd29uZGVybGFuZCB0cmFpbGVy",
                    InTheaters = true,
                    ReleaseDate = new DateTime(2010, 3, 5),
                    Poster = "http://localhost:5156/movies/f114e023-6c72-4753-aecc-d732699af9c0.jpg"
                }
            };

            foreach (var movie in moviesList)
            {
                var movieExist = await context.Movies.FirstOrDefaultAsync(x => x.Title == movie.Title);

                if (movieExist == null)
                {
                    context.Movies.Add(movie);
                }
            }

            await context.SaveChangesAsync();
            
            // Adding movies Actors

            var movieActorsList = new List<MoviesActors>
            {
                new MoviesActors
                {
                    ActorId = 1,
                    MovieId = 1,
                    Character = "Jon Snow",
                    Order = 1
                },
                new MoviesActors
                {
                    ActorId = 2,
                    MovieId = 1,
                    Character = "Daenerys Targaryen",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 3,
                    MovieId = 2,
                    Character = "John Wick (Baba Yaga)",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 4,
                    MovieId = 3,
                    Character = "Dr Smolder Bravestone",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 5,
                    MovieId = 1,
                    Character = "Khal Drogo",
                    Order = 2
                },
                new MoviesActors
                {
                    ActorId = 5,
                    MovieId = 4,
                    Character = "Aquaman",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 5,
                    MovieId = 7,
                    Character = "Dante Reyes",
                    Order = 1
                },
                new MoviesActors
                {
                    ActorId = 7,
                    MovieId = 5,
                    Character = "Jack Sparrow",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 7,
                    MovieId = 10,
                    Character = "Hatter",
                    Order = 1
                },
                new MoviesActors
                {
                    ActorId = 8,
                    MovieId = 6,
                    Character = "Cole Turner",
                    Order = 1
                },
                new MoviesActors
                {
                    ActorId = 9,
                    MovieId = 6,
                    Character = "Sadie Rhodes",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 10,
                    MovieId = 7,
                    Character = "Dominic Toretto",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 11,
                    MovieId = 8,
                    Character = "Jake Sully",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 12,
                    MovieId = 8,
                    Character = "Neytiri",
                    Order = 1
                },
                new MoviesActors
                {
                    ActorId = 13,
                    MovieId = 9,
                    Character = "Katniss Everdeen",
                    Order = 0
                },
                new MoviesActors
                {
                    ActorId = 14,
                    MovieId = 10,
                    Character = "Alice",
                    Order = 0
                }
            };

            foreach (var movieActor in movieActorsList)
            {
                var actorExist = await context.MoviesActors.FirstOrDefaultAsync(x =>
                    x.MovieId == movieActor.MovieId && x.ActorId == movieActor.ActorId);

                if (actorExist == null)
                {
                    context.MoviesActors.Add(movieActor);
                }
            }

            await context.SaveChangesAsync();
            
            // Adding movies genres

            var moviesGenresList = new List<MoviesGenres>
            {
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 1
                },
                new MoviesGenres
                {
                    GenreId = 3,
                    MovieId = 1
                },
                new MoviesGenres
                {
                    GenreId = 4,
                    MovieId = 1
                },
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 2
                },
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 3
                },
                new MoviesGenres
                {
                    GenreId = 2,
                    MovieId = 3
                },
                new MoviesGenres
                {
                    GenreId = 3,
                    MovieId = 3
                },
                new MoviesGenres
                {
                    GenreId = 4,
                    MovieId = 3
                },
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 4
                },
                new MoviesGenres
                {
                    GenreId = 4,
                    MovieId = 4
                },
                new MoviesGenres
                {
                    GenreId = 8,
                    MovieId = 4
                },
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 5
                },
                new MoviesGenres
                {
                    GenreId = 2,
                    MovieId = 5
                },
                new MoviesGenres
                {
                    GenreId = 3,
                    MovieId = 5
                },
                new MoviesGenres
                {
                    GenreId = 4,
                    MovieId = 5
                },
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 6
                },
                new MoviesGenres
                {
                    GenreId = 2,
                    MovieId = 6
                },
                new MoviesGenres
                {
                    GenreId = 3,
                    MovieId = 6
                },
                new MoviesGenres
                {
                    GenreId = 6,
                    MovieId = 6
                },
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 7
                },
                new MoviesGenres
                {
                    GenreId = 3,
                    MovieId = 7
                },
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 8
                },
                new MoviesGenres
                {
                    GenreId = 3,
                    MovieId = 8
                },
                new MoviesGenres
                {
                    GenreId = 4,
                    MovieId = 8
                },
                new MoviesGenres
                {
                    GenreId = 5,
                    MovieId = 8
                },
                new MoviesGenres
                {
                    GenreId = 8,
                    MovieId = 8
                },
                new MoviesGenres
                {
                    GenreId = 1,
                    MovieId = 9
                },
                new MoviesGenres
                {
                    GenreId = 3,
                    MovieId = 9
                },
                new MoviesGenres
                {
                    GenreId = 8,
                    MovieId = 9
                },
                new MoviesGenres
                {
                    GenreId = 4,
                    MovieId = 10
                },
                new MoviesGenres
                {
                    GenreId = 7,
                    MovieId = 10
                }
            };

            foreach (var moviesGenre in moviesGenresList)
            {
                var genreExist = await context.MoviesGenres.FirstOrDefaultAsync(x =>
                    x.MovieId == moviesGenre.MovieId && x.GenreId == moviesGenre.GenreId);

                if (genreExist == null)
                {
                    context.MoviesGenres.Add(moviesGenre);
                }
            }

            await context.SaveChangesAsync();
            
            // Adding movies movie theaters

            var moviesMovitetheatersList = new List<MoviesTheatersMovies>
            {
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 1
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 2,
                    MovieId = 1
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 2,
                    MovieId = 2
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 3
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 4
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 2,
                    MovieId = 4
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 5
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 2,
                    MovieId = 5
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 6
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 7
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 2,
                    MovieId = 7
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 8
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 2,
                    MovieId = 8
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 9
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 2,
                    MovieId = 9
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 1,
                    MovieId = 10
                },
                new MoviesTheatersMovies
                {
                    MovieTheaterId = 2,
                    MovieId = 10
                }
            };

            foreach (var moviesMovietheater in moviesMovitetheatersList)
            {
                var movieTheaterExist = await context.MovieTheatersMovies.FirstOrDefaultAsync(x =>
                    x.MovieId == moviesMovietheater.MovieId && x.MovieTheaterId == moviesMovietheater.MovieTheaterId);

                if (movieTheaterExist == null)
                {
                    context.MovieTheatersMovies.Add(moviesMovietheater);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}