import {favouriteMovieDetailsDTO, movieDTO, watchedMovieDetailsDTO} from "./movies.model";
import css from './IndividualMovie.module.css'
import Button from "../utils/Button";
import customConfirm from "../utils/customConfirm";
import axios from "axios";
import {urlMovies} from "../endpoints";
import {useContext} from "react";
import AlertContext from "../utils/AlertContext";
import Authorized from "../auth/Authorized";
import {Link} from "react-router-dom";

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
            <Link to={buildLink()}>
                <img alt="Poster" src={props.model.poster}/>
            </Link>
            <p>
                <Link to={buildLink()}>{props.model.title}</Link>
            </p>
            <Authorized
                role={'admin'}
                authorized={<div>
                    <Link style={{marginRight: '1rem'}} className="btn btn-info"
                          to={`/movies/edit/${props.model.id}`}>Edit</Link>
                    <Button
                        onClick={() => customConfirm(() => deleteMovie())} className="btn btn-danger">Delete</Button>
                </div>}/>
        </div>
    )
}

interface individualMovieProps {
    model: movieDTO | favouriteMovieDetailsDTO | watchedMovieDetailsDTO;
}