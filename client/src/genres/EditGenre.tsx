import GenreForm from "./GenreForm";
import {urlGenres, urlServer} from "../endpoints";
import {genreCreationDTO, genreDTO} from "./genres.model";
import EditEntity from "../utils/EditEntity";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function EditGenre() {

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

    return (
        <>
            <EditEntity<genreCreationDTO, genreDTO>
                url={urlGenres} entityName="Genres"
                indexURL="/genres"
            >
                {(entity, edit) =>
                    <GenreForm model={entity}
                               onSubmit={async value => {
                                   await edit(value);
                               }}/>
                }
            </EditEntity>
        </>
    );
}