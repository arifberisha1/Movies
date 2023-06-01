import MovieTheaterForm from "./MovieTheaterForm";
import EditEntity from "../utils/EditEntity";
import {movieTheaterCreationDTO, movieTheaterDTO} from "./movieTheater.model";
import {urlMovieTheaters, urlServer} from "../endpoints";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function EditMovieTheater() {

    const navigate = useNavigate();

    useEffect(() => {
        isRunning();
    })

    async function isRunning(){
        try {
            await axios.get(`${urlServer}/running`);
        }catch (error){
            navigate(0);
        }
    }

    return (
        <EditEntity<movieTheaterCreationDTO, movieTheaterDTO>
            url={urlMovieTheaters} indexURL="/movietheaters" entityName="Movie Theater"

        >
            {(entity, edit) =>
            <MovieTheaterForm model={entity}
              onSubmit={async values => await edit(values)}
            />
                }


        </EditEntity>
    );
}