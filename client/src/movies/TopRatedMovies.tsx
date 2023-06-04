import {useEffect, useState} from "react";
import {topRatedDTO} from "./movies.model";
import axios, {AxiosResponse} from "axios";
import {urlMovies, urlServer} from "../endpoints";
import MoviesList from "./MoviesList";
import {useNavigate} from "react-router-dom";

export default function TopRatedMovies() {

    const [movies, setMovies] = useState<topRatedDTO[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        isRunning();
    })

    async function isRunning() {
        try {
            await axios.get(`${urlServer}/running`);
        } catch (error) {
            navigate(0);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        axios.get(`${urlMovies}/topRated`).then((response: AxiosResponse<topRatedDTO[]>) => {
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