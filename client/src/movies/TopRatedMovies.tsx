import {useEffect, useState} from "react";
import {movieDTO} from "./movies.model";
import axios, {AxiosResponse} from "axios";
import {urlMovies} from "../endpoints";
import MoviesList from "./MoviesList";

export default function TopRatedMovies() {

    const [movies, setMovies] = useState<movieDTO[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        axios.get(`${urlMovies}/topRated`).then((response: AxiosResponse<movieDTO[]>) => {
        setMovies(response.data);
    });
}

return (
    <>
        <h3>Top Rated</h3>
        <br/>
        <MoviesList movies={movies}/>
    </>
);
}