import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {urlMovies} from "../endpoints";
import {useParams} from "react-router-dom";
import {movieDTO} from "./movies.model";
import Loading from "../utils/Loading";
import ReactMarkdown from "react-markdown";
import Map from "../utils/Map";
import coordinateDTO from "../utils/coordinates.model";

export default function MovieDetails() {

    const {id}: any = useParams();
    const [movie, setMovie] = useState<movieDTO>();

    useEffect(() => {
        axios.get(`${urlMovies}/${id}`)
            .then((response: AxiosResponse<movieDTO>) => {
                response.data.releaseDate = new Date(response.data.releaseDate);
                setMovie(response.data);
            })
    }, [id])

    function transformCoordinates(): coordinateDTO[] {
        if (movie?.movieTheaters) {
            const coordinates = movie.movieTheaters.map(movieTheater => {
                return {
                    lat: movieTheater.latitude,
                    lng: movieTheater.longitude,
                    name: movieTheater.name
                } as coordinateDTO
            });
            return coordinates;
        }
        return [];
    }

    function generateEmbeddedVideoURL(trailer: string): string {
        if (!trailer) {
            return '';
        }

        let videoId = trailer.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }

        return `https://www.youtube.com/embed/${videoId}`;
    }

    return (
        movie ? <div>
            <h2>{movie.title} ({movie.releaseDate.getFullYear()})</h2>
            {movie.genres?.map(genre =>
                <a href={`/movies/filter?genreId=${genre.id}`} key={genre.id} style={{marginRight: '5px'}}
                   className={"btn btn-primary btn-sm rounded-pill"}>{genre.name}</a>
            )} | {movie.releaseDate.toDateString()}

            <div style={{display: 'flex', marginTop: '1rem'}}>
               <span style={{display: 'inline-block', marginRight: '1rem'}}>
                   <img src={movie.poster} style={{width: '225px', height: '315px'}} alt={"Poster"}/>
               </span>
                {movie.trailer ? <div>
                    <iframe
                        title={"youtube-trailer"}
                        width={"560"}
                        height={"315"}
                        src={generateEmbeddedVideoURL(movie.trailer)}
                        frameBorder={0}
                        allow={"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"}
                        allowFullScreen
                    ></iframe>
                </div> : null}
            </div>

            {movie.summary ? <div style={{marginTop: '1rem'}}>
                <h3>Summary</h3>
                <div>
                    <ReactMarkdown>{movie.summary}</ReactMarkdown>
                </div>
            </div> : null}

            {movie.actors && movie.actors.length > 0 ?
                <div style={{marginTop: '1rem'}}>
                    <h3>Actors</h3>
                    <div style={{display: 'flex', flexDirection: 'column'}}>

                        {/*<table>*/}
                        {/*    <thead>*/}
                        {/*    <th>Image</th>*/}
                        {/*    <th>Actor Name</th>*/}
                        {/*    <th></th>*/}
                        {/*    <th>Character</th>*/}
                        {/*    <th></th>*/}
                        {/*    </thead>*/}
                        {/*    {movie.actors?.map(actor => {*/}
                        {/*        <tbody>*/}
                        {/*            <td></td>*/}
                        {/*            <td></td>*/}
                        {/*            <td></td>*/}
                        {/*            <td></td>*/}
                        {/*            <td></td>*/}
                        {/*        </tbody>*/}
                        {/*    })}*/}
                        {/*</table>*/}


                        {movie.actors?.map(actor =>
                            <div key={actor.id} style={{marginBottom: '2px'}}>
                                <img src={actor.picture} alt="pic" style={{width: '50px', verticalAlign: 'middle'}}/>
                                <span style={{
                                    display: 'inline-block',
                                    width: '200px',
                                    marginLeft: '1rem'
                                }}>{actor.name}</span>
                                <span style={{display: 'inline-block', width: '45px'}}>...</span>
                                <span>{actor.character}</span>
                                <a href={`/actors/details/${actor.id}`} className={"btn btn-dark ms-5 location-fixed"}>More</a>
                            </div>
                        )}
                    </div>
                </div> : null}

            {movie.movieTheaters && movie.movieTheaters.length > 0 ? <div>
                <h2>Showing on</h2>
                <Map coordinates={transformCoordinates()} readOnly={true}/>
            </div> : null}
        </div> : <Loading/>
    )
}