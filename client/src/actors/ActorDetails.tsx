import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {actorCreationDTO, actorDTO} from "./actors.model";
import axios, {AxiosResponse} from "axios";
import {urlActors, urlMovies} from "../endpoints";
import ReactMarkdown from "react-markdown";
import MoviesList from "../movies/MoviesList";
import {movieDTO} from "../movies/movies.model";

export default function ActorDetails() {

    const {id}: any = useParams();
    const [details, setDetails] = useState<actorCreationDTO>();
    const [movies, setMovies] = useState<movieDTO[]>([]);

    useEffect(() => {
        axios.get(`${urlActors}/${id}`)
            .then((response: AxiosResponse<actorDTO>) => {
                setDetails(transform(response.data));
            })

        axios.get(`${urlMovies}/getActorMovies/${id}`)
            .then((response2: AxiosResponse<movieDTO[]>) => {
                setMovies(response2.data);
            })
    }, [id]);

    function transform(actor: actorDTO): actorCreationDTO {
        return {
            name: actor.name,
            pictureURL: actor.picture,
            biography: actor.biography,
            dateOfBirth: new Date(actor.dateOfBirth)
        }
    }

    return (
        <>
            <h3>Actor Details</h3>

            <div className={"actor-container"}>
                <div className={"container-left"}>
                    <img src={details?.pictureURL} alt="ActorImage"/>
                </div>
                <div className={"container-right"}>
                    <p>
                        Name: {details?.name}
                    </p>
                    <ReactMarkdown>{details?.biography!}</ReactMarkdown>
                    <p>
                        Birthday: {details?.dateOfBirth?.toDateString()}
                    </p>
                </div>
                <Link to="/actors" className={"btn btn-dark back-a"}>Back</Link>
            </div>
            <br/>
            <h3>{details?.name}'s Movies</h3>
            <MoviesList movies={movies}/>
        </>
    );
}