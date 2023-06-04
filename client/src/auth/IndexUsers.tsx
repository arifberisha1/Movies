import IndexEntity from "../utils/IndexEntity";
import {userDTO} from "./auth.models";
import {urlAccounts, urlServer} from "../endpoints";
import Button from "../utils/Button";
import customConfirm from "../utils/customConfirm";
import axios, {AxiosResponse} from "axios";
import Swal from "sweetalert2";
import {useContext, useEffect, useState} from "react";
import AuthenticationContext from "./AuthenticationContext";
import {useNavigate} from "react-router-dom";

export default function IndexUsers() {

    const {claims} = useContext(AuthenticationContext);
    const [adminIds, setAdminIds] = useState<string[]>([]);
    const [email, setEmail] = useState<string>('');

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

    useEffect(() => {
        axios.get(`${urlAccounts}/getAdmins`)
            .then((Emails: AxiosResponse<string[]>) => {
                setAdminIds(Emails.data);
                getEmail();
            });
    }, []);

    async function getEmail() {
        claims.map(claim => {
            if (claim.name === 'email') {
                setEmail(claim.value);
            }
        })
    }

    async function makeAdmin(id: string) {
        await doAdmin(`${urlAccounts}/makeAdmin`, id);
    }

    async function removeAdmin(id: string) {
        await doAdmin(`${urlAccounts}/removeAdmin`, id);
    }

    async function doAdmin(url: string, id: string) {
        await axios.post(url, JSON.stringify(id), {
            headers: {'Content-Type': 'application/json'}
        });

        Swal.fire({
            title: 'Success',
            text: 'Operation finished correctly',
            icon: 'success'
        }).then(() => {
            window.location.reload();
        });
    }

    return (
        <IndexEntity<userDTO>
            title={"Users"}
            url={`${urlAccounts}/listUsers`}>
            {users => <>
                <thead>
                <tr>
                    {email === "admin@admin.com" ?
                        <th></th>
                        : null}
                    <th>Email</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>

                {users?.map(user => <tr key={user.id}>
                    {email === "admin@admin.com" ?
                        <td>
                            {user.email !== "admin@admin.com" ?
                                adminIds.includes(user.id) ? <Button
                                        className={"btn btn-danger"}
                                        onClick={() => customConfirm(() => removeAdmin(user.id),
                                            `Do you wish to remove ${user.email} as an admin?`, 'Do it')}
                                    >Remove Admin</Button> :
                                    <Button
                                        onClick={() => customConfirm(() => makeAdmin(user.id),
                                            `Do you wish to make ${user.email} an admin?`, 'Do it')}
                                    >Make Admin</Button>
                                : null}
                        </td>
                        : null}
                    <td>
                        {user.email}
                    </td>
                    <td>
                        {adminIds.includes(user.id) ? <>Admin</> : <>User</>}
                    </td>
                </tr>)}
                </tbody>
            </>}
        </IndexEntity>
    );
}