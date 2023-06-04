import {favouriteMovieDetailsDTO, movieDTO, topRatedDTO, watchedMovieDetailsDTO} from "./movies.model";
import IndividualMovie from "./IndividualMovie";
import css from './MoviesList.module.css';
import GenericList from "../utils/GenericList";
import React from "react";

export default function MoviesList(props: moviesListProps) {
    return <GenericList
        list={props.movies}>
        <div className={css.div}>
            {
                props.movies?.map(movie =>
                    <IndividualMovie model={movie} key={movie.id}/>
                )}
        </div>
    </GenericList>
}

interface moviesListProps {
    movies?: movieDTO[] | favouriteMovieDetailsDTO[] | watchedMovieDetailsDTO[] | topRatedDTO[];
}