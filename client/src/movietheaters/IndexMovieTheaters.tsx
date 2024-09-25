import IndexEntity from "../utils/IndexEntity";
import { movieTheaterDTO } from "./movieTheater.model";
import { urlMovieTheaters } from "../endpoints";
import { useNavigate } from "react-router-dom";

export default function IndexMovieTheaters() {
  const navigate = useNavigate();

  return (
    <IndexEntity<movieTheaterDTO>
      url={urlMovieTheaters}
      createURL="/movietheaters/create"
      title="Movie Theaters"
      entityName="Movie Theater"
    >
      {(entities, buttons) => (
        <>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {entities?.map((entity) => (
              <tr key={entity.id}>
                <td>
                  {buttons(`/movietheaters/edit/${entity.id}`, entity.id)}
                </td>
                <td>{entity.name}</td>
                <td>
                  <a href={entity.link} target={"_blank"}>
                    {entity.link}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </>
      )}
    </IndexEntity>
  );
}
