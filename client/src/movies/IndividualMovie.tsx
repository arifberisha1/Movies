import {movieDTO} from "./movies.model";
import css from './IndividualMovie.module.css'
import Button from "../utils/Button";
import customConfirm from "../utils/customConfirm";
import axios from "axios";
import {urlMovies} from "../endpoints";
import {useContext} from "react";
import AlertContext from "../utils/AlertContext";

export default function IndividualMovie(props: movieDTO) {

    const buildLink = () => `/movie/${props.id}`
    const customAlert = useContext(AlertContext);
    function deleteMovie() {
        axios.delete(`${urlMovies}/${props.id}`)
            .then(() => {
                customAlert();
            });
    }

    return (
        <div className={css.div}>
            <a href={buildLink()}>
                <img alt="Poster" src={props.poster}/>
            </a>
            <p>
                <a href={buildLink()}>{props.title}</a>
            </p>

            <div>
                <a style={{marginRight: '1rem'}} className="btn btn-info"
                   href={`/movies/edit/${props.id}`}>Edit</a>
                <Button
                onClick={() => customConfirm(() => deleteMovie() )} className="btn btn-danger">Delete</Button>
            </div>
        </div>
    )
}