import GenreForm from "./GenreForm";
import {genreCreationDTO} from "./genres.model";
import axios from "axios";
import {urlGenres} from "../endpoints";
import {useHistory} from "react-router-dom";
import {useState} from "react";
import DisplayErrors from "../utils/DisplayErrors";

export default function CreateGenres() {

    const history = useHistory();
    const [errors, setErrors] = useState<string[]>([]);
    async function create(genre: genreCreationDTO){
        try {
            await axios.post(urlGenres, genre)
            history.push('/genres');
            window.location.reload();
        }
        catch (error){

            // @ts-ignore
            if (error && error.response){
                // @ts-ignore
                setErrors(error.response.data);

            }
        }
    }

    return (
        <>
            <h3>Create Genre</h3>
            <DisplayErrors errors={errors} />
            <GenreForm model={{name: ''}}
                       onSubmit={async value => {
                           await create(value);
                       }}
            />
        </>
    );
}