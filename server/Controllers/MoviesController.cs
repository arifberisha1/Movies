using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;
using server.Helpers;

namespace server.Controllers
{
    [Route("api/movies")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IFileStorageService fileStorageService;
        private readonly UserManager<IdentityUser> UserManager;
        private string container = "movies";

        public MoviesController(ApplicationDbContext context, IMapper mapper,
            IFileStorageService fileStorageService, UserManager<IdentityUser> userManager)
        {
            this.context = context;
            this.mapper = mapper;
            this.fileStorageService = fileStorageService;
            this.UserManager = userManager;
        }

        /// <summary>
        /// Retrieves the landing page data.
        /// </summary>
        /// <returns>The landing page data.</returns>
        /// <response code="200">The landing page data was retrieved successfully.</response>
        [ProducesResponseType(typeof(LandingPageDTO), StatusCodes.Status200OK)]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<LandingPageDTO>> Get()
        {
            var top = 6;
            var today = DateTime.Today;

            var upcomingReleases = await context.Movies
                .Where(x => x.ReleaseDate > today)
                .OrderBy(x => x.ReleaseDate)
                .Take(top)
                .ToListAsync();

            var inTheaters = await context.Movies
                .Where(x => x.InTheaters)
                .OrderBy(x => x.ReleaseDate)
                .Take(top)
                .ToListAsync();

            var landingPageDTO = new LandingPageDTO();
            landingPageDTO.UpcomingReleases = mapper.Map<List<MovieDTO>>(upcomingReleases);
            landingPageDTO.InTheaters = mapper.Map<List<MovieDTO>>(inTheaters);
            return landingPageDTO;
        }

        /// <summary>
        /// Retrieves typeahead movie suggestions.
        /// </summary>
        /// <returns>The list of typeahead movie suggestions.</returns>
        /// <response code="200">The typeahead movie suggestions were retrieved successfully.</response>
        [ProducesResponseType(typeof(List<MoviesTypeaheadDTO>), StatusCodes.Status200OK)]
        [HttpGet("typeahead")]
        [AllowAnonymous]
        public async Task<ActionResult<List<MoviesTypeaheadDTO>>> GetTypeahead()
        {
            List<MoviesTypeaheadDTO> typeaheadList = new List<MoviesTypeaheadDTO>();

            var movies = await context.Movies.OrderBy(x => x.Title).ToListAsync();

            if (movies == null)
            {
                return typeaheadList;
            }

            foreach (var movie in movies)
            {
                var typeahead = new MoviesTypeaheadDTO()
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    Poster = movie.Poster
                };

                typeaheadList.Add(typeahead);
            }

            return typeaheadList;
        }
        
        /// <summary>
        /// Retrieves the top-rated movies.
        /// </summary>
        /// <returns>The list of top-rated movies.</returns>
        /// <response code="200">The top-rated movies were retrieved successfully.</response>
        [ProducesResponseType(typeof(List<MovieDTO>), StatusCodes.Status200OK)]
        [HttpGet("topRated")]
        [AllowAnonymous]
        public async Task<ActionResult<List<TopRatedDTO>>> GetTopRatedMovies()
        {
            var movies = await context.Movies.ToListAsync();

            List<TopRatedDTO> topRatedList = new List<TopRatedDTO>();

            foreach (var movie in movies)
            {
                var averageVote = await context.Ratings.Where(x => x.MovieId == movie.Id)
                    .AverageAsync(x => x.Rate);
                
                var topRatedDto = new TopRatedDTO()
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    Poster = movie.Poster,
                    AverageVote = averageVote
                };
                topRatedList.Add(topRatedDto);
            }

            topRatedList = topRatedList.OrderByDescending(x => x.AverageVote).Take(5).ToList();
            
            List<TopRatedDTO> topFiveMovies = new List<TopRatedDTO>();

            foreach (var topRated in topRatedList)
            {
                if (topRated.AverageVote != 0)
                {
                    topFiveMovies.Add(topRated);
                }
            }
            
            return topFiveMovies;
        }
        
        /// <summary>
        /// Retrieves the movies associated with a specific actor.
        /// </summary>
        /// <param name="id">The ID of the actor.</param>
        /// <returns>The list of movies associated with the actor.</returns>
        /// <response code="200">The movies associated with the actor were retrieved successfully.</response>
        /// <response code="204">There are no movies associated with the actor.</response>
        [ProducesResponseType(typeof(List<MovieDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [HttpGet("getActorMovies/{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<MovieDTO>>> GetMoviesByActor(int id)
        {
            var actorMovies = await context.Movies
                .Where(movie => movie.MoviesActors.Any(actor => actor.ActorId == id))
                .ToListAsync();

            if (actorMovies.Count == 0)
            {
                return new List<MovieDTO>(); // Return an empty list instead of null
            }

            var movieDTOs = mapper.Map<List<MovieDTO>>(actorMovies);
            return movieDTOs;
        }
        
        /// <summary>
        /// Retrieves a movie by its ID.
        /// </summary>
        /// <param name="id">The ID of the movie.</param>
        /// <returns>The movie with the specified ID.</returns>
        /// <response code="200">The movie was retrieved successfully.</response>
        /// <response code="404">The movie with the specified ID was not found.</response>
        [ProducesResponseType(typeof(MovieDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<MovieDTO>> Get(int id)
        {
            var movie = await context.Movies
                .Include(x => x.MoviesGenres).ThenInclude(x => x.Genre)
                .Include(x => x.MoviesTheatersMovies).ThenInclude(x => x.MovieTheater)
                .Include(x => x.MoviesActors).ThenInclude(x => x.Actor)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            var averageVote = 0.0;
            var userVote = 0;

            if (await context.Ratings.AnyAsync(x => x.MovieId == id))
            {
                averageVote = await context.Ratings.Where(x => x.MovieId == id)
                    .AverageAsync(x => x.Rate);

                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
                    var user = await UserManager.FindByEmailAsync(email);
                    var userId = user.Id;

                    var ratingDb = await context.Ratings.FirstOrDefaultAsync(x => x.MovieId == id
                        && x.UserId == userId);

                    if (ratingDb != null)
                    {
                        userVote = ratingDb.Rate;
                    }
                }
            }

            var dto = mapper.Map<MovieDTO>(movie);
            dto.AverageVote = averageVote;
            dto.UserVote = userVote;
            dto.Actors = dto.Actors.OrderBy(x => x.Order).ToList();
            return dto;
        }

        /// <summary>
        /// Retrieves all movies with pagination.
        /// </summary>
        /// <param name="paginationDto">Pagination parameters.</param>
        /// <returns>A paginated list of movies.</returns>
        /// <response code="200">The movies were retrieved successfully.</response>
        [ProducesResponseType(typeof(List<MovieDTO>), StatusCodes.Status200OK)]
        [HttpGet("all")]
        public async Task<ActionResult<List<MovieDTO>>> GetAll([FromQuery] PaginationDTO paginationDto)
        {
            var queryable = context.Movies.AsQueryable();
            await HttpContext.InsertParametersPaginationInHeader(queryable);
            var movies = await queryable.OrderBy(x => x.Title).Paginate(paginationDto).ToListAsync();
            return mapper.Map<List<MovieDTO>>(movies);
        }

        /// <summary>
        /// Filters movies based on the specified criteria.
        /// </summary>
        /// <param name="filterMoviesDto">Filter criteria.</param>
        /// <returns>A paginated list of filtered movies.</returns>
        /// <response code="200">The movies were filtered successfully.</response>
        [ProducesResponseType(typeof(List<MovieDTO>), StatusCodes.Status200OK)]
        [HttpGet("filter")]
        [AllowAnonymous]
        public async Task<ActionResult<List<MovieDTO>>> Filter([FromQuery] FilterMoviesDTO filterMoviesDto)
        {
            var moviesQueryable = context.Movies.AsQueryable();

            if (filterMoviesDto.Title == "_" && !filterMoviesDto.InTheaters
                                             && !filterMoviesDto.UpcomingReleases &&
                                             filterMoviesDto.GenreId == 0)
            {
                return await GetAll(filterMoviesDto.PaginationDto);
            }

            if (filterMoviesDto.Title != "_")
            {
                moviesQueryable = moviesQueryable.Where(x => x.Title.Contains(filterMoviesDto.Title));
            }

            if (filterMoviesDto.InTheaters)
            {
                moviesQueryable = moviesQueryable.Where(x => x.InTheaters);
            }

            if (filterMoviesDto.UpcomingReleases)
            {
                var today = DateTime.Today;
                moviesQueryable = moviesQueryable.Where(x => x.ReleaseDate > today);
            }

            if (filterMoviesDto.GenreId != 0)
            {
                moviesQueryable = moviesQueryable
                    .Where(x => x.MoviesGenres.Select(y => y.GenreId)
                        .Contains(filterMoviesDto.GenreId));
            }

            await HttpContext.InsertParametersPaginationInHeader(moviesQueryable);
            var movies = await moviesQueryable.OrderBy(x => x.Title).Paginate(filterMoviesDto.PaginationDto)
                .ToListAsync();
            return mapper.Map<List<MovieDTO>>(movies);
        }

        /// <summary>
        /// Retrieves the data required for creating a movie.
        /// </summary>
        /// <returns>Data for movie creation.</returns>
        /// <response code="200">The data was retrieved successfully.</response>
        [ProducesResponseType(typeof(MoviePostGetDTO), StatusCodes.Status200OK)]
        [HttpGet("PostGet")]
        public async Task<ActionResult<MoviePostGetDTO>> PostGet()
        {
            var movieTheaters = await context.MovieTheaters.ToListAsync();
            var genres = await context.Genres.ToListAsync();

            var movieTheatersDTO = mapper.Map<List<MovieTheaterDTO>>(movieTheaters);
            var genresDTO = mapper.Map<List<GenreDTO>>(genres);

            return new MoviePostGetDTO() { Genres = genresDTO, MovieTheaters = movieTheatersDTO };
        }

        /// <summary>
        /// Creates a new movie.
        /// </summary>
        /// <param name="movieCreationDTO">The data for creating the movie.</param>
        /// <returns>The ID of the created movie.</returns>
        /// <response code="200">The movie was created successfully.</response>
        /// <response code="400">Invalid data provided.</response>
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost]
        public async Task<ActionResult<int>> Post([FromForm] MovieCreationDTO movieCreationDTO)
        {
            var movie = mapper.Map<Movie>(movieCreationDTO);

            if (movieCreationDTO.Poster != null)
            {
                movie.Poster = await fileStorageService.SaveFile(container, movieCreationDTO.Poster);
            }

            AnnotateActorsOrder(movie);
            context.Add(movie);
            await context.SaveChangesAsync();
            return movie.Id;
        }

        /// <summary>
        /// Retrieves the data necessary for updating a movie.
        /// </summary>
        /// <param name="id">The ID of the movie.</param>
        /// <returns>The movie data along with additional information for updating.</returns>
        /// <response code="200">The movie data and additional information were retrieved successfully.</response>
        /// <response code="404">The movie with the specified ID was not found.</response>
        [ProducesResponseType(typeof(MoviePutGetDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("putget/{id:int}")]
        public async Task<ActionResult<MoviePutGetDTO>> PutGet(int id)
        {
            var movieActionResult = await Get(id);
            if (movieActionResult.Result is NotFoundResult)
            {
                return NotFound();
            }

            var movie = movieActionResult.Value;

            var genreSelectedIds = movie.Genres.Select(x => x.Id).ToList();
            var nonSelectedGenres = await context.Genres.Where(x => !genreSelectedIds.Contains(x.Id))
                .ToListAsync();

            var movieTheatersIds = movie.MovieTheaters.Select(x => x.Id).ToList();
            var nonSelectedMovieTheaters = await context.MovieTheaters.Where(x =>
                !movieTheatersIds.Contains(x.Id)).ToListAsync();

            var nonSelectedGenresDTOs = mapper.Map<List<GenreDTO>>(nonSelectedGenres);
            var nonSelectedMovieTheatersDTO = mapper.Map<List<MovieTheaterDTO>>(nonSelectedMovieTheaters);

            var response = new MoviePutGetDTO();
            response.Movie = movie;
            response.SelectedGenres = movie.Genres;
            response.NonSelectedGenres = nonSelectedGenresDTOs;
            response.SelectedMovieTheaters = movie.MovieTheaters;
            response.NonSelectedMovieTheaters = nonSelectedMovieTheatersDTO;
            response.Actors = movie.Actors;
            return response;
        }

        /// <summary>
        /// Updates the details of a movie.
        /// </summary>
        /// <param name="id">The ID of the movie to update.</param>
        /// <param name="movieCreationDto">The updated movie data.</param>
        /// <returns>No content if the movie was successfully updated.</returns>
        /// <response code="204">The movie was successfully updated.</response>
        /// <response code="404">The movie with the specified ID was not found.</response>
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpPut("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult> Put(int id, [FromForm] MovieCreationDTO movieCreationDto)
        {
            var movie = await context.Movies.Include(x => x.MoviesActors)
                .Include(x => x.MoviesGenres)
                .Include(x => x.MoviesTheatersMovies)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            movie = mapper.Map(movieCreationDto, movie);


            try
            {
                if (movieCreationDto.Poster != null)
                {
                    movie.Poster = await fileStorageService.EditFile(container, movieCreationDto.Poster,
                        movie.Poster);
                }
            }
            catch (Exception e)
            {
                return BadRequest("Poster could not be saved!");
            }
            

            AnnotateActorsOrder(movie);
            await context.SaveChangesAsync();
            return NoContent();
        }

        private void AnnotateActorsOrder(Movie movie)
        {
            if (movie.MoviesActors != null)
            {
                for (int i = 0; i < movie.MoviesActors.Count; i++)
                {
                    movie.MoviesActors[i].Order = i;
                }
            }
        }

        /// <summary>
        /// Deletes a movie and its associated comments.
        /// </summary>
        /// <param name="id">The ID of the movie to delete.</param>
        /// <returns>No content if the movie was successfully deleted.</returns>
        /// <response code="204">The movie and its associated comments were successfully deleted.</response>
        /// <response code="404">The movie with the specified ID was not found.</response>
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var movie = await context.Movies.FirstOrDefaultAsync(x => x.Id == id);

            if (movie == null)
            {
                return NotFound();
            }
            
            var comments = await context.Comment.Where(x => x.MovieId == id).ToListAsync();

            if (comments != null)
            {
                foreach (var comment in comments)
                {
                    context.Remove(comment);
                }
            }

            context.Remove(movie);
            await context.SaveChangesAsync();
            await fileStorageService.DeleteFile(movie.Poster, container);
            return NoContent();
        }
    }
}