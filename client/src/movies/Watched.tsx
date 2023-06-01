import {useContext, useEffect, useState} from "react";
import {watchedMovieDetailsDTO} from "./movies.model";
import AuthenticationContext from "../auth/AuthenticationContext";
import axios, {AxiosResponse} from "axios";
import {urlServer, urlWatched} from "../endpoints";
import MoviesList from "./MoviesList";
import {useNavigate} from "react-router-dom";

export default function Watched(){

    const [errors, setErrors] = useState<string[]>([]);
    const [movies, setMovies] = useState<watchedMovieDetailsDTO[]>([]);
    const {claims} = useContext(AuthenticationContext);

    const navigate = useNavigate();

    useEffect(() => {
        isRunning();
    })

    async function isRunning(){
        try {
            await axios.get(`${urlServer}/running`);
        }catch (error){
            navigate(0);
        }
    }

    useEffect(() => {

        claims.map(claim => {
            if (claim.name === 'email') {
                getMovies(claim.value);
            }
        })
    }, [claims]);

    async function getMovies(email: string) {
        console.log("Email: " + email);
        setErrors([]);
        try {
            await axios.get(`${urlWatched}/getByUserEmail/${email}`)
                .then((response: AxiosResponse<watchedMovieDetailsDTO[]>) => {
                    setMovies(response.data);
                });
        } catch (error) {
            // @ts-ignore
            setErrors(error.response.data);
            console.log(errors);
        }
    }

    return(
        <>
            <h3>Watched Movies</h3>
            <br/>
            <MoviesList movies={movies}/>
        </>
    );
}