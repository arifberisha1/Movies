import {useHistory, useParams} from "react-router-dom";
import GenreForm from "./GenreForm";
import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {urlGenres} from "../endpoints";
import {genreCreationDTO} from "./genres.model";
import Loading from "../utils/Loading";
import DisplayErrors from "../utils/DisplayErrors";

export default function EditGenre() {
    const {id}: any = useParams();
    const [genre, setGenre]= useState<genreCreationDTO>();
    const [errors, setErrors] = useState<string[]>([]);
    const history= useHistory();


    useEffect(() => {
        axios.get(`${urlGenres}/${id}`)
            .then((response: AxiosResponse<genreCreationDTO>) => {
                setGenre(response.data)
            })
    }, [id]);

    async function edit(genreToEdit: genreCreationDTO){
        try {
            await axios.put(`${urlGenres}/${id}`, genreToEdit);
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
            <h3>Edit Genre</h3>
            <DisplayErrors errors={errors}/>
            {genre ? <GenreForm model={genre}
                                onSubmit={async value => {
                                    await edit(value);

                                }}
            /> : <Loading/>}

        </>
    );
}