import MoviesList from "./MoviesList";
import React, {useContext, useEffect, useState} from "react";
import {landingPageDTO} from "./movies.model";
import axios, {AxiosResponse} from "axios";
import {urlMovies} from "../endpoints";
import AlertContext from "../utils/AlertContext";
import Authorized from "../auth/Authorized";
import AuthenticationContext from "../auth/AuthenticationContext";
import {useHistory} from "react-router-dom";

export default function LandingPage() {

    const [movies, setMovies] = useState<landingPageDTO>({});
    const history = useHistory();

    useEffect(() => {
        loadData();
        history.push('/');
    },[]);

    function loadData() {
        axios.get(urlMovies).then((response: AxiosResponse<landingPageDTO>) => {
            setMovies(response.data);
        });
    }

    const {claims} = useContext(AuthenticationContext);

    return (
        <AlertContext.Provider value={() => {
            loadData();
        }}>

            <Authorized authorized={<>{claims.map(claim => claim.value)}</>}
            notAuthorized={<>You are not authorized</>}
            />

            <h3>In Theaters</h3>
            <MoviesList movies={movies.inTheaters?.slice().reverse()}/>
            <h3>Upcoming Releases</h3>
            <MoviesList movies={movies.upcomingReleases}/>
        </AlertContext.Provider>
    );
}