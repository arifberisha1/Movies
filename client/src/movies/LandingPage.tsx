import MoviesList from "./MoviesList";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {landingPageDTO, moviesTypeahead} from "./movies.model";
import axios, {AxiosResponse} from "axios";
import {urlMovies} from "../endpoints";
import AlertContext from "../utils/AlertContext";
import {useHistory} from "react-router-dom";
import {Typeahead} from "react-bootstrap-typeahead";
import AuthenticationContext from "../auth/AuthenticationContext";

export default function LandingPage(props: landingPageProps) {

    const {claims} = useContext(AuthenticationContext);
    const [movies, setMovies] = useState<landingPageDTO>({});
    const [taMovies, setTaMovies] = useState<moviesTypeahead[]>([]);
    const history = useHistory();

    useEffect(() => {
        if (props.reload) {
            history.push('/');
        }
        loadData();
    }, []);

    function loadData() {
        axios.get(urlMovies).then((response: AxiosResponse<landingPageDTO>) => {
            setMovies(response.data);
        });

        axios.get(`${urlMovies}/typeahead`).then((taResponse: AxiosResponse<moviesTypeahead[]>) => {
            setTaMovies(taResponse.data);
        })
    }

    return (
        <AlertContext.Provider value={() => {
            loadData();
        }}>

            {claims.length > 0 ? <Typeahead
                className={"mt-3 mb-3 typeahead"}
                id="selections-example"
                labelKey="title"
                onInputChange={(text: string, e: ChangeEvent<HTMLInputElement>) => {
                    console.log(text, e);
                }}
                options={taMovies}
                placeholder="Search movies..."
                onChange={(selected: any[]) => {
                    const clickedMovie = selected[0];
                    if (clickedMovie) {
                        history.push(`movie/${clickedMovie.id}`);
                        window.location.reload();
                    }
                }}
                renderMenuItemChildren={movie => (
                    <>
                        <img src={
                            // @ts-ignore
                            movie.poster} alt="movie"
                             style={{
                                 height: '64px',
                                 marginRight: '10px',
                                 width: '64px'
                             }}/>
                        <span>{
                            // @ts-ignore
                            movie.title}</span>
                    </>
                )}
            /> : null}

            <h3>In Theaters</h3>
            <MoviesList movies={movies.inTheaters?.slice().reverse()}/>
            <h3>Upcoming Releases</h3>
            <MoviesList movies={movies.upcomingReleases}/>
        </AlertContext.Provider>
    );
}

interface landingPageProps {
    reload?: boolean;
}