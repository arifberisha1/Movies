import MovieForm from "./MovieForm";
import {genreDTO} from "../genres/genres.model";
import {movieTheaterDTO} from "../movietheaters/movieTheater.model";
import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {urlMovies, urlServer} from "../endpoints";
import {movieCreationDTO, moviesPostGetDTO} from "./movies.model";
import Loading from "../utils/Loading";
import {convertMovieToFormData} from "../utils/formDataUtils";
import {useNavigate} from "react-router-dom";
import DisplayErrors from "../utils/DisplayErrors";

export default function CreateMovie() {

    const [nonSelectedGenres, setNonSelectedGenres] = useState<genreDTO[]>([]);
    const [nonSelectedMovieTheaters, setNonSelectedMovieTheaters] = useState<movieTheaterDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        isRunning();
    })

    async function isRunning() {
        try {
            await axios.get(`${urlServer}/running`);
        } catch (error) {
            navigate(0);
        }
    }

    useEffect(() => {
        axios.get(`${urlMovies}/postget`)
            .then((response: AxiosResponse<moviesPostGetDTO>) => {
                setNonSelectedGenres(response.data.genres);
                setNonSelectedMovieTheaters(response.data.movieTheaters);
                setLoading(false);
            })
    }, [])

    async function create(movie: movieCreationDTO) {
        try {
            const formData = convertMovieToFormData(movie);
            const response = await axios({
                method: 'post',
                url: urlMovies,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'}
            })

            navigate(`/movie/${response.data}`);

        } catch (error) {
            // @ts-ignore
            setErrors(error.response.data);
        }
    }

    return (
        <>
            <h3>Create Movie</h3>
            <DisplayErrors errors={errors}/>
            {loading ? <Loading/> :
                <MovieForm model={{title: '', inTheaters: false, trailer: ''}}
                           onSubmit={async values => await create(values)}
                           nonSelectedGenres={nonSelectedGenres}
                           selectedGenres={[]}
                           nonSelectedMovieTheaters={nonSelectedMovieTheaters}
                           selectedMovieTheaters={[]}
                           selectedActors={[]}
                />}
        </>
    );
}