import GenreForm from "./GenreForm";
import { urlGenres } from "../endpoints";
import { genreCreationDTO, genreDTO } from "./genres.model";
import EditEntity from "../utils/EditEntity";
import { useNavigate } from "react-router-dom";

export default function EditGenre() {
  const navigate = useNavigate();
  return (
    <>
      <EditEntity<genreCreationDTO, genreDTO>
        url={urlGenres}
        entityName="Genres"
        indexURL="/genres"
      >
        {(entity, edit) => (
          <GenreForm
            model={entity}
            onSubmit={async (value) => {
              await edit(value);
            }}
          />
        )}
      </EditEntity>
    </>
  );
}
