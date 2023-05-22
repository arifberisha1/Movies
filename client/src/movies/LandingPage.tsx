import MoviesList from "./MoviesList";
import React, {useEffect, useState} from "react";
import {landingPageDTO} from "./movies.model";
import axios, {AxiosResponse} from "axios";
import {urlMovies} from "../endpoints";
import AlertContext from "../utils/AlertContext";
import {useHistory} from "react-router-dom";

export default function LandingPage(props: landingPageProps) {

    const [movies, setMovies] = useState<landingPageDTO>({});
    const history = useHistory();

    useEffect(() => {
        if (props.reload){
        history.push('/');
        }
        loadData();
    },[]);

    function loadData() {
        axios.get(urlMovies).then((response: AxiosResponse<landingPageDTO>) => {
            setMovies(response.data);
        });
    }
    return (
        <AlertContext.Provider value={() => {
            loadData();
        }}>
            <h3>In Theaters</h3>
            <MoviesList movies={movies.inTheaters?.slice().reverse()}/>
            <h3>Upcoming Releases</h3>
            <MoviesList movies={movies.upcomingReleases}/>
        </AlertContext.Provider>
    );
}

interface landingPageProps{
    reload?: boolean;
}