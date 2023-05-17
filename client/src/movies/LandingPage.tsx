import MoviesList from "./MoviesList";
import React, {useEffect, useState} from "react";
import {landingPageDTO} from "./movies.model";

export default function LandingPage() {

    const [movies, setMovies] = useState<landingPageDTO>({});

    useEffect(() => {

    },[]);

    return (
        <>
            <h3>In Theaters</h3>
            <MoviesList movies={movies.inTheaters}/>
            <h3>Upcoming Releases</h3>
            <MoviesList movies={movies.upcomingReleases}/>
        </>
    );
}