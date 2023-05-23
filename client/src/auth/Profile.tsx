import Button from "../utils/Button";
import {useContext, useEffect, useState} from "react";
import AuthenticationContext from "./AuthenticationContext";
import {useHistory} from "react-router-dom";
import LandingPage from "../movies/LandingPage";

export default function Profile() {

    const [email, setEmail] = useState<string>("");
    const {claims} = useContext(AuthenticationContext);
    const history = useHistory();

    useEffect(() => {
        claims.map(claim => {
            if (claim.name === "email") {
                setEmail(claim.value);
            }
        })
    }, [claims]);

    return (
        <>
            {claims.length > 0 ? <>

                    <h3>Profile</h3>
                    <br/>

                    <div className={"profile-container"}>
                        <p>
                            Name: Name
                        </p>
                        <p>
                            Surname: Surname
                        </p>
                        <p>
                            Birthday: Birthday
                        </p>
                        <p>
                            Gender: Gender
                        </p>
                        <p>
                            Address: Address
                        </p>
                        <p>
                            Email: {email}
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