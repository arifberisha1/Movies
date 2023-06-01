import {Route, Routes} from "react-router-dom";
import LandingPage from "./movies/LandingPage";
import IndexGenres from "./genres/IndexGenres";
import CreateGenres from "./genres/CreateGenres";
import Login from "./auth/Login";
import React, {useContext, useEffect, useState} from "react";
import IndexActors from "./actors/IndexActors";
import AuthenticationContext from "./auth/AuthenticationContext";
import FilterMovies from "./movies/FilterMovies";
import EditGenre from "./genres/EditGenre";
import CreateActors from "./actors/CreateActors";
import EditActor from "./actors/EditActor";
import ActorDetails from "./actors/ActorDetails";
import IndexMovieTheaters from "./movietheaters/IndexMovieTheaters";
import CreateMovieTheater from "./movietheaters/CreateMovieTheater";
import EditMovieTheater from "./movietheaters/EditMovieTheater";
import CreateMovie from "./movies/CreateMovie";
import EditMovie from "./movies/EditMovie";
import TopRatedMovies from "./movies/TopRatedMovies";
import Favourite from "./movies/Favourite";
import Watched from "./movies/Watched";
import MovieDetails from "./movies/MovieDetails";
import Register from "./auth/Register";
import IndexUsers from "./auth/IndexUsers";
import Profile from "./auth/Profile";
import ChangePassword from "./auth/ChangePassword";
import EditUser from "./auth/EditUser";
import IndexWebsites from "./Websites/IndexWebsites";
import CreateWebsite from "./Websites/CreateWebsite";
import EditWebsite from "./Websites/EditWebsite";
import Menu from "./Menu";
import axios from "axios";
import {urlServer} from "./endpoints";
import sadFace from "./sadFace.png";

export default function Routing(props: routingProps) {

    const {claims} = useContext(AuthenticationContext);
    const [running, setRunning] = useState<boolean>(false);

    useEffect(() => {
        isRunning();
        const interval = setInterval(() => {
            isRunning();
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    async function isRunning() {
        try {
            await axios.get(`${urlServer}/running`);
            if (!running) {
                setRunning(true);
            }
        } catch (error) {
            setRunning(false);
        }
    }

    return (
        running ?
            <>
                <Menu/>
                <div className={'container'}>

                    <Routes>

                        // no user or admin needed
                        <Route path={"/"} element={<LandingPage/>}/>
                        <Route path={"/movies/filter"} element={<FilterMovies/>}/>
                        <Route path={"/movie/:id"} element={<MovieDetails/>}/>
                        <Route path={"/actors/details/:id"} element={<ActorDetails/>}/>

                        <Route/>

                        {!props.isAdmin && claims.length <= 0 ?
                            <>
                                <Route path={"/register"} element={<Register/>}/>
                                <Route path={"/login"} element={<Login/>}/>
                            </> : <Route path={"*"} element={<LandingPage/>}/>
                        }

                        // admin access only
                        {props.isAdmin ?
                            <>
                                <Route path={"/genres"} element={<IndexGenres/>}/>
                                <Route path={"/genres/create"} element={<CreateGenres/>}/>
                                <Route path={"/genres/edit/:id"} element={<EditGenre/>}/>

                                <Route path={"/actors/create"} element={<CreateActors/>}/>
                                <Route path={"/actors/edit/:id"} element={<EditActor/>}/>

                                <Route path={"/websites/create"} element={<CreateWebsite/>}/>
                                <Route path={"/websites/edit/:id"} element={<EditWebsite/>}/>

                                <Route path={"/movietheaters"} element={<IndexMovieTheaters/>}/>
                                <Route path={"/movietheaters/create"} element={<CreateMovieTheater/>}/>
                                <Route path={"/movietheaters/edit/:id"} element={<EditMovieTheater/>}/>

                                <Route path={"/movies/create"} element={<CreateMovie/>}/>
                                <Route path={"/movies/edit/:id"} element={<EditMovie/>}/>

                                <Route path={"/users"} element={<IndexUsers/>}/>

                            </> : <Route path={"*"} element={<LandingPage/>}/>}

                        // user & admin access only
                        {claims.length > 0 ?
                            <>
                                <Route path={"/actors"} element={<IndexActors/>}/>

                                <Route path={"/websites"} element={<IndexWebsites/>}/>

                                <Route path={"/movies/topRated"} element={<TopRatedMovies/>}/>
                                <Route path={"/movies/favourite"} element={<Favourite/>}/>
                                <Route path={"/movies/watched"} element={<Watched/>}/>

                                <Route path={"/profile"} element={<Profile/>}/>
                                <Route path={"/changepassword"} element={<ChangePassword/>}/>
                                <Route path={"/edituser"} element={<EditUser/>}/>

                            </> :
                            <Route path={"*"} element={<LandingPage/>}/>}
                    </Routes>
                </div>
            </> : <>
                <Menu/>
                <br/><br/><br/><br/><br/>
                <div className={"server-error"}>Server is down temporarily!</div>
                <div className={"server-error"}>We will be back soon!</div>
                <img src={sadFace} alt="Sad Face" className={"sad-img"}/>
            </>
    );
}

interface routingProps {
    isAdmin: boolean;
}