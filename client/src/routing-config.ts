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
import Register from "./auth/Register";
import Login from "./auth/Login";
import IndexUsers from "./auth/IndexUsers";
import Profile from "./auth/Profile";
import ChangePassword from "./auth/ChangePassword";
import EditUser from "./auth/EditUser";

const routes = [

    {path: "/genres", component: IndexGenres, exact: true, isAdmin: true},
    {path: "/genres/create", component: CreateGenres, isAdmin: true},
    {path: "/genres/edit/:id(\\d+)", component: EditGenre, isAdmin: true},

    {path: "/actors", component: IndexActors, exact: true, isAdmin: true},
    {path: "/actors/create", component: CreateActors, isAdmin: true},
    {path: "/actors/edit/:id(\\d+)", component: EditActor, isAdmin: true},

    {path: "/movietheaters", component: IndexMovieTheaters, exact: true, isAdmin: true},
    {path: "/movietheaters/create", component: CreateMovieTheater, isAdmin: true},
    {path: "/movietheaters/edit/:id(\\d+)", component: EditMovieTheater, isAdmin: true},

    {path: "/movies/create", component: CreateMovie, isAdmin: true},
    {path: "/movies/edit/:id(\\d+)", component: EditMovie, isAdmin: true},
    {path: "/movies/filter", component: FilterMovies},
    {path: "/movie/:id(\\d+)", component: MovieDetails},

    {path: "/register", component: Register},
    {path: "/login", component: Login},
    {path: "/users", component: IndexUsers, isAdmin: true},
    {path: "/profile", component: Profile},
    {path: "/changepassword", component: ChangePassword},
    {path: "/edituser", component: EditUser},

    {path: "/", component: LandingPage, exact: true},
    {path: "*", component: LandingPage}
];

export default routes;