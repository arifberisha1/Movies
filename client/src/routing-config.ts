import RedirectToLandingPage from "./utils/RedirectToLandingPage";
import IndexGenres from "./genres/IndexGenres";
import LandingPage from "./movies/LandingPage";
import CreateGenres from "./genres/CreateGenres";
import EditGenre from "./genres/EditGenre";
import IndexActors from "./actors/IndexActors";
import CreateActors from "./actors/CreateActors";
import EditActor from "./actors/EditActor";
import IndexMovieTheaters from "./movietheaters/IndexMovieTheaters";
import CreateMovieTheater from "./movietheaters/CreateMovieTheater";
import EditMovieTheater from "./movietheaters/EditMovieTheater";
import CreateMovie from "./movies/CreateMovie";
import EditMovie from "./movies/EditMovie";
import FilterMovies from "./movies/FilterMovies";
import MovieDetails from "./movies/MovieDetails";

const routes = [

    {path: "/genres", component: IndexGenres, exact: true},
    {path: "/genres/create", component: CreateGenres},
    {path: "/genres/edit/:id(\\d+)", component: EditGenre},

    {path: "/actors", component: IndexActors, exact: true},
    {path: "/actors/create", component: CreateActors},
    {path: "/actors/edit/:id(\\d+)", component: EditActor},

    {path: "/movietheaters", component: IndexMovieTheaters, exact: true},
    {path: "/movietheaters/create", component: CreateMovieTheater},
    {path: "/movietheaters/edit/:id(\\d+)", component: EditMovieTheater},

    {path: "/movies/create", component: CreateMovie},
    {path: "/movies/edit/:id(\\d+)", component: EditMovie},
    {path: "/movies/filter", component: FilterMovies},
    {path: "/movie/:id(\\d+)", component: MovieDetails},

    {path: "/", component: LandingPage, exact: true},
    {path: "*", component: RedirectToLandingPage}
];

export default routes;