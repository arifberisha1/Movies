import GenreForm from "./GenreForm";
import {genreCreationDTO} from "./genres.model";
import axios from "axios";
import {urlGenres} from "../endpoints";
import {useHistory} from "react-router-dom";

export default function CreateGenres() {

    const history = useHistory();
    async function create(genre: genreCreationDTO){
        try {
            await axios.post(urlGenres, genre)
            history.push('/genres');
            window.location.reload();
        }
        catch (error){
            console.error(error);
        }
    }

    return (
        <>
            <h3>Create Genre</h3>
            <GenreForm model={{name: ''}}
                       onSubmit={async value => {
                           await create(value);
                       }}
            />
        </>
    );
}