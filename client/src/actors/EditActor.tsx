import ActorForm from "./ActorForm";
import EditEntity from "../utils/EditEntity";
import {actorCreationDTO, actorDTO} from "./actors.model";
import {urlActors, urlServer} from "../endpoints";
import {convertActorToFormData} from "../utils/formDataUtils";
import {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function EditActor() {

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

    function transform(actor: actorDTO): actorCreationDTO {
        return {
            name: actor.name,
            pictureURL: actor.picture,
            biography: actor.biography,
            dateOfBirth: new Date(actor.dateOfBirth)
        }
    }

    return (
        <EditEntity<actorCreationDTO, actorDTO>
            url={urlActors}
            indexURL={"/actors"}
            entityName={"Actor"}
            transformFormData={convertActorToFormData}
            transform={transform}
        >

            {(entity, edit) =>
                <ActorForm model={entity}
                           onSubmit={async values => await edit(values)}/>
            }

        </EditEntity>
    );
}