import MovieTheaterForm from "./MovieTheaterForm";
import EditEntity from "../utils/EditEntity";
import { movieTheaterCreationDTO, movieTheaterDTO } from "./movieTheater.model";
import { urlMovieTheaters } from "../endpoints";
import { useNavigate } from "react-router-dom";

export default function EditMovieTheater() {
  const navigate = useNavigate();

  return (
    <EditEntity<movieTheaterCreationDTO, movieTheaterDTO>
      url={urlMovieTheaters}
      indexURL="/movietheaters"
      entityName="Movie Theater"
    >
      {(entity, edit) => (
        <MovieTheaterForm
          model={entity}
          onSubmit={async (values) => await edit(values)}
        />
      )}
    </EditEntity>
  );
}
