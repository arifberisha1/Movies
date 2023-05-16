import MovieForm from "./MovieForm";
import {genreDTO} from "../genres/genres.model";
import {movieTheaterCreationDTO, movieTheaterDTO} from "../movietheaters/movieTheater.model";
import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {urlMovies} from "../endpoints";
import {moviesPostGetDTO} from "./movies.model";
import Loading from "../utils/Loading";

export default function CreateMovie() {

    const [nonSelectedGenres, setNonSelectedGenres] = useState<genreDTO[]>([]);
    const [nonSelectedMovieTheaters, setNonSelectedMovieTheaters] = useState<movieTheaterDTO[]>([]);
    const [loading, setLoading] =  useState(true);

    useEffect(() =>{
        axios.get(`${urlMovies}/postget`)
            .then((response: AxiosResponse<moviesPostGetDTO>) => {
            setNonSelectedGenres(response.data.genres);
            setNonSelectedMovieTheaters(response.data.movieTheaters);
            setLoading(false);
        })
    }, [])



    return (
        <>
            <h3>Create Movie</h3>
            {loading ? <Loading/> :
            <MovieForm model={{title: '', inTheaters: false, trailer: ''}}
                       onSubmit={values => console.log(values)}
                       nonSelectedGenres={nonSelectedGenres}
                       selectedGenres={[]}
                       nonSelectedMovieTheaters={nonSelectedMovieTheaters}
                       selectedMovieTheaters={[]}
                       selectedActors={[]}
            />}
        </>
    );
}