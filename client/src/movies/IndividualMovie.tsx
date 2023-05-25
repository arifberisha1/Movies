import {favouriteMovieDetailsDTO, movieDTO, watchedMovieDetailsDTO} from "./movies.model";
import css from './IndividualMovie.module.css'
import Button from "../utils/Button";
import customConfirm from "../utils/customConfirm";
import axios from "axios";
import {urlMovies} from "../endpoints";
import {useContext} from "react";
import AlertContext from "../utils/AlertContext";
import Authorized from "../auth/Authorized";

export default function IndividualMovie(props: individualMovieProps) {

    const buildLink = () => `/movie/${props.model.id}`
    const customAlert = useContext(AlertContext);

    function deleteMovie() {
        axios.delete(`${urlMovies}/${props.model.id}`)
            .then(() => {
                customAlert();
            });
    }

    return (
        <div className={css.div}>
            <a href={buildLink()}>
                <img alt="Poster" src={props.model.poster}/>
            </a>
            <p>
                <a href={buildLink()}>{props.model.title}</a>
            </p>
            <Authorized
                role={'admin'}
                authorized={<div>
                    <a style={{marginRight: '1rem'}} className="btn btn-info"
                       href={`/movies/edit/${props.model.id}`}>Edit</a>
                    <Button
                        onClick={() => customConfirm(() => deleteMovie())} className="btn btn-danger">Delete</Button>
                </div>}/>
        </div>
    )
}

interface individualMovieProps{
    model: movieDTO | favouriteMovieDetailsDTO | watchedMovieDetailsDTO;
}