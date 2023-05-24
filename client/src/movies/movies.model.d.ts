import {actorMovieDTO} from "../actors/actors.model";
import {genreDTO} from "../genres/genres.model";
import {movieTheaterDTO} from "../movietheaters/movieTheater.model";

export interface movieDTO {
    id: number;
    title: string;
    summary?: string;
    trailer: string;
    inTheaters: boolean;
    releaseDate: Date;
    poster: string;
    genres: genreDTO[];
    movieTheaters: movieTheaterDTO[];
    actors: actorMovieDTO[];
    userVote: number;
    averageVote: number;
}

export interface moviesTypeahead{
    id: number,
    title: string,
    poster: string
}

export interface movieCreationDTO {
    title: string;
    inTheaters: boolean;
    trailer: string;
    summary?: string;
    releaseDate?: Date;
    poster?: File;
    posterURL?: string;
    genresIds?: number[];
    movieTheatersIds?: number[];
    actors?: actorMovieDTO[];
}

export interface landingPageDTO {
    inTheaters?: movieDTO[];
    upcomingReleases?: movieDTO[];
}

export interface moviesPostGetDTO{
    genres: genreDTO[];
    movieTheaters: movieTheaterDTO[];
}

export interface moviePutGetDTO{
    movie: movieDTO;
    selectedGenres: genreDTO[];
    nonSelectedGenres: genreDTO[];
    selectedMovieTheaters: movieTheaterDTO[];
    nonSelectedMovieTheaters: movieTheaterDTO[];
    actors: actorMovieDTO[];
}