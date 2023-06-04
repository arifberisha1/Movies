import IndexEntity from "../utils/IndexEntity";
import {movieTheaterDTO} from "./movieTheater.model";
import {urlMovieTheaters, urlServer} from "../endpoints";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function IndexMovieTheaters() {

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
        <IndexEntity<movieTheaterDTO>
            url={urlMovieTheaters} createURL="/movietheaters/create" title="Movie Theaters"
            entityName="Movie Theater"
        >

            {(entities, buttons) => <>
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Link</th>
                </tr>
                </thead>
                <tbody>
                {entities?.map(entity => <tr key={entity.id}>
                    <td>
                        {buttons(`/movietheaters/edit/${entity.id}`, entity.id)}
                    </td>
                    <td>
                        {entity.name}
                    </td>
                    <td>
                        <a href={entity.link} target={"_blank"}>{entity.link}</a>
                    </td>
                </tr>)}
                </tbody>

            </>}
        </IndexEntity>
    )
}