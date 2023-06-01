import {authenticationResponse, userCreationDTO, userDetails} from "./auth.models";
import axios from "axios";
import {urlAccounts, urlServer} from "../endpoints";
import React, {useContext, useEffect, useState} from "react";
import DisplayErrors from "../utils/DisplayErrors";
import AuthFormRegister from "./AuthFormRegister";
import {getClaims, saveToken} from "./handleJWT";
import AuthenticationContext from "./AuthenticationContext";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {

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

    async function register(details: userDetails) {
        if (details.password === details.confirmPassword) {
            setErrors([]);
            const userCreationDetails: userCreationDTO = {
                email: details.email,
                password: details.password,
                name: details.name,
                surname: details.surname,
                birthday: details.birthday,
                gender: details.gender,
                address: details.address
            };
            console.log(userCreationDetails);
            try {
                setErrors([]);
                const response = await axios
                    .post<authenticationResponse>(`${urlAccounts}/create`, userCreationDetails);
                saveToken(response.data);
                update(getClaims());

                Swal.fire({
                    title: 'Success',
                    text: 'User registered successfully',
                    icon: 'success'
                }).then(() => {
                    navigate('/');
                });
            } catch (error) {
                // @ts-ignore
                setErrors(error.response.data);
            }
        } else {
            let error: string[] = ["Passwords don't match",];
            setErrors(error);
        }
    }

    return (
        <>
            <h3>Register</h3>
            <DisplayErrors errors={errors}/>
            <AuthFormRegister model={{
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                surname: '',
                birthday: new Date(''),
                gender: '',
                address: ''
            }}
                              onSubmit={async values => await register(values)}/>
        </>
    );
}