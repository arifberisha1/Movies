import GenreForm from "./GenreForm";
import {genreCreationDTO} from "./genres.model";
import axios from "axios";
import {urlGenres, urlServer} from "../endpoints";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import DisplayErrors from "../utils/DisplayErrors";

export default function CreateGenres() {

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

    async function create(genre: genreCreationDTO) {
        try {
            await axios.post(urlGenres, genre)
            navigate('/genres');
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
            <h3>Create Genre</h3>
            <DisplayErrors errors={errors}/>
            <GenreForm model={{name: ''}}
                       onSubmit={async value => {
                           await create(value);
                       }}
            />
        </>
    );
}