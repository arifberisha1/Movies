import {useContext, useEffect, useState} from "react";
import AuthenticationContext from "./AuthenticationContext";
import LandingPage from "../movies/LandingPage";
import DisplayErrors from "../utils/DisplayErrors";
import ChangePasswordForm from "./ChangePasswordForm";
import {authenticationResponse, changePassword, changePasswordForm} from "./auth.models";
import axios from "axios";
import {urlAccounts, urlServer} from "../endpoints";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";


export default function ChangePassword() {

    const {claims} = useContext(AuthenticationContext);
    const [Email, setEmail] = useState<string>("");
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

    useEffect(() => {
        claims.map(claim => {
            if (claim.name === "email") {
                setEmail(claim.value);
            }
        })
    },[claims])

    async function changePassword(data: changePasswordForm) {
        if (data.newPassword === data.confirmNewPassword) {
            setErrors([]);
            const changePasswordDetails: changePassword = {
                email: Email,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            };
            try {
                setErrors([]);
                const response = await axios
                    .put<authenticationResponse>(`${urlAccounts}/changePassword`, changePasswordDetails);

                // @ts-ignore
                Swal.fire({
                    title: 'Success',
                    text: response.data,
                    icon: 'success'
                }).then(() => {
                    navigate('/profile');
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
            {claims.length > 0 ?
                <>
                    <h3>Change Password</h3>
                    <DisplayErrors errors={errors}/>
                    <ChangePasswordForm model={{
                        oldPassword: '',
                        newPassword: '',
                        confirmNewPassword: ''
                    }}
                                        onSubmit={async values => await changePassword(values)}/>
                </> :
                <LandingPage/>}
        </>
    );
}