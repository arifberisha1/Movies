import {authenticationResponse, userCredentials} from "./auth.models";
import axios from "axios";
import {urlAccounts} from "../endpoints";
import {useState} from "react";
import DisplayErrors from "../utils/DisplayErrors";
import AuthForm from "./AuthForm";

export default function Register(){

    const [errors, setErrors] = useState<string[]>([]);

    async function register(credentials: userCredentials){
        try {
            setErrors([]);
            const response = await axios
                .post<authenticationResponse>(`${urlAccounts}/create`, credentials);
            console.log(response.data);
        }
        catch (error){
            // @ts-ignore
            setErrors(error.response.data);
        }
    }

    return(
        <>
            <h3>Register</h3>
            <DisplayErrors errors={errors}/>
            <AuthForm model={{email: '', password: ''}}
                      onSubmit={async values => await register(values)}/>
        </>
    );
}