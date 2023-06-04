import {urlGenres, urlServer} from "../endpoints";
import {genreDTO} from "./genres.model";
import IndexEntity from "../utils/IndexEntity";
import {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function IndexGenres() {

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

            <IndexEntity<genreDTO>
                url={urlGenres} createURL='/genres/create' title="Genres"
                entityName="Genre"
            >
                {(genres, buttons) =>
                    <>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {genres?.map(genre =>
                            <tr key={genre.id}>
                                <td>
                                    {buttons(`/genres/edit/${genre.id}`, genre.id)}
                                </td>
                                <td>
                                    {genre.name}
                                </td>
                            </tr>)}
                        </tbody>
                    </>
                }

            </IndexEntity>

        </>
    );
}