import AuthFormLogin from "./AuthFormLogin";
import {authenticationResponse, userCredentials} from "./auth.models";
import axios from "axios";
import {urlAccounts, urlServer} from "../endpoints";
import {useContext, useEffect, useState} from "react";
import DisplayErrors from "../utils/DisplayErrors";
import {getClaims, saveToken} from "./handleJWT";
import AuthenticationContext from "./AuthenticationContext";
import {useNavigate} from "react-router-dom";

export default function Login(){

    const [errors, setErrors] = useState<string[]>([]);
    const {update} = useContext(AuthenticationContext);
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

    async function login(credentials: userCredentials){
        try {
            setErrors([]);
            const response = await axios
                .post<authenticationResponse>(`${urlAccounts}/login`, credentials);
            saveToken(response.data);
            update(getClaims());
            navigate('/');
        }
        catch (error){
            // @ts-ignore
            setErrors(error.response.data);
        }
    }

    return(
      <>
        <h3>Login</h3>
          <DisplayErrors errors={errors}/>
          <AuthFormLogin model={{email: '', password: ''}}
                         onSubmit={async values => await login(values)}/>
      </>
    );
}