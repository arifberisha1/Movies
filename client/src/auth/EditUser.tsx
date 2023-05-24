import {useContext, useEffect, useState} from "react";
import AuthenticationContext from "./AuthenticationContext";
import LandingPage from "../movies/LandingPage";
import EditUserForm from "./EditUserForm";
import {editUser, individualUserDetails} from "./auth.models";
import axios, {AxiosResponse} from "axios";
import {urlAccounts} from "../endpoints";
import Swal from "sweetalert2";
import {useHistory} from "react-router-dom";
import DisplayErrors from "../utils/DisplayErrors";

export default function EditUser() {

    const {claims} = useContext(AuthenticationContext);
    const [erros, setErrors] = useState<string[]>([]);
    const [email, setEmail] = useState<string>("");
    const history = useHistory();
    useEffect(() => {
        claims.map(claim => {
            if (claim.name === 'email') {
                setEmail(claim.value);
            }
        })
    }, [claims]);

    async function edit(editUser: editUser) {
        const data: individualUserDetails = {
            email: email,
            name: editUser.name,
            surname: editUser.surname,
            birthday: editUser.birthday,
            gender: editUser.gender,
            address: editUser.address
        }
        try {
            setErrors([]);
            const response = await axios
                .post<AxiosResponse>(`${urlAccounts}/editUser`, data);

            // @ts-ignore
            Swal.fire({
                title: 'Success',
                text: response.data,
                icon: 'success'
            }).then(() => {
                history.push('/profile');
                window.location.reload();
            });
        } catch (error) {
            // @ts-ignore
            setErrors(error.response.data);
        }
    }

    return (
        <>

            {claims.length > 0 ?
                <>

                    <h3>Edit User</h3>
                    <DisplayErrors errors={erros}/>
                    <EditUserForm
                        model={{
                            name: '',
                            surname: '',
                            birthday: new Date(''),
                            gender: '',
                            address: '',
                        }}
                        onSubmit={async values => await edit(values)}/>

                </> :
                <LandingPage/>}


        </>
    );
}