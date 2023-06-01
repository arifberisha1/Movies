import ActorForm from "./ActorForm";
import {actorCreationDTO} from "./actors.model";
import {useEffect, useState} from "react";
import DisplayErrors from "../utils/DisplayErrors";
import {convertActorToFormData} from "../utils/formDataUtils";
import axios from "axios";
import {urlActors, urlServer} from "../endpoints";
import {useNavigate} from "react-router-dom";

export default function CreateActors() {

    const [errors, setErrors] = useState<string[]>([]);
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

    async function create(actor: actorCreationDTO){
        try {
            const formData = convertActorToFormData(actor);

            await axios({
                method: 'post',
                url: urlActors,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'}
            });
            navigate('/actors');
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
            <h3>Create Actor</h3>

            <DisplayErrors errors={errors} />

            <ActorForm
                model={{name: '', dateOfBirth: undefined}}
                onSubmit={async values => await create(values)}/>
        </>
    );
}