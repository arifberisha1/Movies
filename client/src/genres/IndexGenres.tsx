import {useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import {genreDTO} from "./genres.model";
import {urlGenres} from "../endpoints";

export default function IndexGenres() {

    useEffect(() => {
         axios.get(urlGenres)
            .then((response: AxiosResponse<genreDTO[]>) => {
                console.log(response.data);
            })
    }, );

    return (
        <>
            <h3>Genres</h3>
            <a href="/genres/create" className={"btn btn-primary"}>Create Genre</a>
        </>
    );
}