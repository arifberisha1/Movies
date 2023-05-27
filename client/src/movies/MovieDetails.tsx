import React, {useContext, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {urlComments, urlFavourite, urlMovies, urlRatings, urlWatched} from "../endpoints";
import {Link, useParams} from "react-router-dom";
import {movieDTO} from "./movies.model";
import Loading from "../utils/Loading";
import ReactMarkdown from "react-markdown";
import Map from "../utils/Map";
import coordinateDTO from "../utils/coordinates.model";
import Ratings from "../utils/Ratings";
import Swal from "sweetalert2";
import CommentSection from "../utils/CommentSection";
import AuthenticationContext from "../auth/AuthenticationContext";
import {commentCreationDTO, commentFormDTO} from "../utils/comment.model";
import CommentForm from "../utils/CommentForm";
import DisplayErrors from "../utils/DisplayErrors";
import AddRemoveButtons from "../utils/AddRemoveButtons";

export default function MovieDetails() {

    const {id}: any = useParams();
    const [movie, setMovie] = useState<movieDTO>();
    const [error, setErrors] = useState<string[]>([]);
    const {claims} = useContext(AuthenticationContext);

    useEffect(() => {
        axios.get(`${urlMovies}/${id}`)
            .then((response: AxiosResponse<movieDTO>) => {
                response.data.releaseDate = new Date(response.data.releaseDate);
                setMovie(response.data);
            });
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

    function handleRate(rate: number) {
        axios.post(urlRatings, {rating: rate, movieId: id}).then(() => {
            Swal.fire({icon: 'success', title: 'Rating received'}).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        })
    }

    function getEmail() {
        var email = '';
        claims.map(claim => {
            if (claim.name === 'email') {
                email = claim.value;
            }
        })
        return email;
    }

    async function AddComment(commentFormDto: commentFormDTO) {
        let commentCreationDto: commentCreationDTO = {
            userComment: commentFormDto.comment,
            userEmail: getEmail(),
            movieId: id
        }

        try {
            await axios.post(`${urlComments}/create`, commentCreationDto)
                .then((response: AxiosResponse) => {
                    Swal.fire({
                        title: 'Success',
                        text: response.data,
                        icon: 'success'
                    }).then(() => {
                        window.location.reload();
                    });
                })
        } catch (error) {
            // @ts-ignore
            setErrors(error.response)
        }
    }

    return (
        movie ? <div>
            <h2>{movie.title} ({movie.releaseDate.getFullYear()})</h2>
            {movie.genres?.map(genre =>
                <Link to={`/movies/filter?genreId=${genre.id}`} key={genre.id} style={{marginRight: '5px'}}
                   className={"btn btn-primary btn-sm rounded-pill"}>{genre.name}</Link>
            )} | {movie.releaseDate.toDateString()}
            | Your vote: <Ratings maximumValue={5} selectedValue={movie.userVote}
                                  onChange={handleRate}/> | Average Vote: <Ratings
            maximumValue={5}
            selectedValue={movie.averageVote}
            onChange={() => {
            }}
            mouseOver={false}
            clickable={false}/>


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
            {claims.length > 0 ?
                <>
                    <br/>
                    <AddRemoveButtons mid={id}
                                      email={getEmail()}
                                      routeURL={urlFavourite}
                                      addButtonText={"Add to favourites"}
                                      removeButtonText={"Remove from favourites"}
                                      url={"isFavourite"}
                                      addButton={async () => {
                                          try {
                                              await axios.post(`${urlFavourite}/create`, {
                                                  email: getEmail(),
                                                  movieId: id
                                              });
                                              Swal.fire({
                                                  title: 'Success',
                                                  text: "Added to favourites successfully!",
                                                  icon: 'success'
                                              }).then(() => {
                                                  window.location.reload();
                                              })

                                          } catch (e) {
                                              console.log(e);
                                          }
                                      }}
                                      removeButton={async () => {
                                          try {
                                              await Swal.fire({
                                                  title: 'Confirmation',
                                                  text: 'Are you sure you want to remove this movie from favourites',
                                                  icon: 'question',
                                                  showCancelButton: true,
                                                  confirmButtonText: 'Yes',
                                                  cancelButtonText: 'No',
                                              }).then(async (result) => {
                                                  if (result.isConfirmed) {
                                                      await axios.delete(`${urlFavourite}/delete/${getEmail()}/${id}`)
                                                          .then((response: AxiosResponse) => {
                                                              Swal.fire({
                                                                  title: 'Success',
                                                                  text: response.data,
                                                                  icon: 'success'
                                                              }).then(() => {
                                                                  window.location.reload();
                                                              })
                                                          });
                                                  }
                                              });
                                          } catch (e) {
                                              console.log(e);
                                          }
                                      }}/>

                    <AddRemoveButtons mid={id}
                                      class={"ms-3"}
                                      email={getEmail()}
                                      routeURL={urlWatched}
                                      addButtonText={"Add to watched"}
                                      removeButtonText={"Remove from watched"}
                                      url={"isWatched"}
                                      addButton={async () => {
                                          try {
                                              await axios.post(`${urlWatched}/create`, {
                                                  email: getEmail(),
                                                  movieId: id
                                              });
                                              Swal.fire({
                                                  title: 'Success',
                                                  text: "Added to watched successfully!",
                                                  icon: 'success'
                                              }).then(() => {
                                                  window.location.reload();
                                              })

                                          } catch (e) {
                                              console.log(e);
                                          }
                                      }}
                                      removeButton={async () => {
                                          try {
                                              await Swal.fire({
                                                  title: 'Confirmation',
                                                  text: 'Are you sure you want to remove this movie from watched',
                                                  icon: 'question',
                                                  showCancelButton: true,
                                                  confirmButtonText: 'Yes',
                                                  cancelButtonText: 'No',
                                              }).then(async (result) => {
                                                  if (result.isConfirmed) {
                                                      await axios.delete(`${urlWatched}/delete/${getEmail()}/${id}`)
                                                          .then((response: AxiosResponse) => {
                                                              Swal.fire({
                                                                  title: 'Success',
                                                                  text: response.data,
                                                                  icon: 'success'
                                                              }).then(() => {
                                                                  window.location.reload();
                                                              })
                                                          });
                                                  }
                                              });
                                          } catch (e) {
                                              console.log(e);
                                          }
                                      }}/>
                </> : null}

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
                                <Link to={`/actors/details/${actor.id}`}
                                   className={"btn btn-dark ms-5 location-fixed"}>More</Link>
                            </div>
                        )}
                    </div>
                </div> : null}

            {movie.movieTheaters && movie.movieTheaters.length > 0 ? <div>
                <br/>
                <h2>Showing on</h2>
                <Map coordinates={transformCoordinates()} readOnly={true}/>
            </div> : null}
            <br/>
            <h3>Comment Section</h3>
            {claims.length > 0 ? <>
                    <DisplayErrors errors={error}/>
                    <CommentForm model={{comment: ''}}
                                 onSubmit={async values => await AddComment(values)}
                    />
                </> :
                null}
            <br/>
            <CommentSection movieId={id}/>


        </div> : <Loading/>
    )
}