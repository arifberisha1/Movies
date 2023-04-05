import RedirectHome from "./RedirectHome";
import Movies from "./Movies";
import Actors from "./Actors";
import Home from "./Home";


const routes = [

    {path: "/movies", component: Movies, exact: true},
    {path: "/actors", component: Actors, exact: true},

    {path: "/", component: Home, exact: true},
    {path: "*", component: RedirectHome}
];

export default routes;