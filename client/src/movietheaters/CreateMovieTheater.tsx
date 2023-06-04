import MovieTheaterForm from "./MovieTheaterForm";
import {movieTheaterCreationDTO} from "./movieTheater.model";
import axios from "axios";
import {urlMovieTheaters, urlServer} from "../endpoints";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import DisplayErrors from "../utils/DisplayErrors";

export default function CreateMovieTheater() {

    const navigate = useNavigate();
    const [errors, setErrors] = useState<string[]>([]);

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

    async function create(movieTheater: movieTheaterCreationDTO) {
        try {
            await axios.post(urlMovieTheaters, movieTheater);
            navigate("/movietheaters");
        } catch (error) {
            // @ts-ignore
            if (error && error.response) {
                // @ts-ignore
                setErrors(error.response.data);
            }
        }
    }

    return (
        <>
            <h3>Create Movie Theater</h3>
            <DisplayErrors errors={errors}/>
            <MovieTheaterForm
                model={{name: '', link: ''}}
                onSubmit={async values => await create(values)}
            />
        </>
    );
}