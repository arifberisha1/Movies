import {useContext, useEffect, useState} from "react";
import AuthenticationContext from "./AuthenticationContext";
import LandingPage from "../movies/LandingPage";
import EditUserForm from "./EditUserForm";
import {editUser, individualUserDetails} from "./auth.models";
import axios, {AxiosResponse} from "axios";
import {urlAccounts} from "../endpoints";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import DisplayErrors from "../utils/DisplayErrors";

export default function EditUser() {

    const {claims} = useContext(AuthenticationContext);
    const [erros, setErrors] = useState<string[]>([]);
    const [email, setEmail] = useState<string>("");
    const [data, setData] = useState<editUser>();
    const navigate = useNavigate();
    useEffect(() => {
        claims.map(claim => {
            if (claim.name === 'email') {
                setEmail(claim.value);
                getData(claim.value);
            }
        })
    }, [claims]);

    async function getData(e: string){
        const response: AxiosResponse<individualUserDetails> = await axios.get(`${urlAccounts}/getByEmail`, {
            params: {email: e}
        });
        const model:editUser = {
            name: response.data.name,
            surname: response.data.surname,
            birthday: new Date(response.data.birthday),
            gender: response.data.gender,
            address: response.data.address
        };

        setData(model);
    }

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
                navigate('/profile');
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
                    {data ?
                    <EditUserForm
                        model={data}
                        onSubmit={async values => await edit(values)}/>
                        : null}

                </> :
                <LandingPage/>}


        </>
    );
}