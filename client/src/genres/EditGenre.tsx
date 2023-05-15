import GenreForm from "./GenreForm";
import {urlGenres} from "../endpoints";
import {genreCreationDTO, genreDTO} from "./genres.model";
import EditEntity from "../utils/EditEntity";

export default function EditGenre() {
    return (
        <>
            <EditEntity<genreCreationDTO, genreDTO>
                url={urlGenres} entityName="Genres"
                indexURL="/genres"
                >
                {(entity, edit)=>
                <GenreForm model={entity}
                           onSubmit={async value =>{
                           await edit(value);
                           }}/>
                }
            </EditEntity>
        </>
    );
}