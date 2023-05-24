import Button from "../utils/Button";
import React, {useContext, useEffect, useState} from "react";
import AuthenticationContext from "./AuthenticationContext";
import {useHistory} from "react-router-dom";
import LandingPage from "../movies/LandingPage";
import {individualUserDetails} from "./auth.models";
import axios from "axios";
import {urlAccounts} from "../endpoints";

export default function Profile() {

    const [details, setDetails] = useState<individualUserDetails>();
    const {claims} = useContext(AuthenticationContext);
    const history = useHistory();

    useEffect(() => {
        claims.map(claim => {
            if (claim.name === "email") {
                getUserDetailsByEmail(claim.value);
            }
        })
    }, [claims]);

    const getUserDetailsByEmail = async (email: string) => {
        try {
            const response = await axios.get(`${urlAccounts}/getByEmail?email=${email}`);
            setDetails(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            {claims.length > 0 ? <>

                    <h3>Profile</h3>
                    <br/>

                    <div className={"profile-container"}>
                        <p>
                            Name: {details?.name}
                        </p>
                        <p>
                            Surname: {details?.surname}
                        </p>
                        <p>
                            Birthday: {details?.birthday.toString().slice(0, 10)}
                        </p>
                        <p>
                            Gender: {details?.gender}
                        </p>
                        <p>
                            Address: {details?.address}
                        </p>
                        <Button
                            className={"btn btn-dark"}
                            onClick={() => {
                                history.push('/changepassword')
                                window.location.reload();
                            }}
                        >
                            Change Password
                        </Button>
                        <Button
                            className={"btn btn-dark margin-left"}
                            onClick={() => {
                                history.push('/edituser');
                                window.location.reload();
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                </> :
                <LandingPage/>
            }
        </>
    );
}