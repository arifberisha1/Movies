import IndexEntity from "../utils/IndexEntity";
import {userDTO} from "./auth.models";
import {urlAccounts} from "../endpoints";
import Button from "../utils/Button";
import customConfirm from "../utils/customConfirm";
import axios, {AxiosResponse} from "axios";
import Swal from "sweetalert2";
import {useEffect, useState} from "react";

export default function IndexUsers() {

    const [adminIds, setAdminIds] = useState<string[]>([]);
    useEffect(() => {
        axios.get(`${urlAccounts}/getAdmins`)
            .then((Emails: AxiosResponse<string[]>) => {
                setAdminIds(Emails.data);
            });
    }, []);

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
                    <th></th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {users?.map(user => <tr key={user.id}>
                    <td>
                        {adminIds.includes(user.id) ? <Button
                            className={"btn btn-danger"}
                            onClick={() => customConfirm(() => removeAdmin(user.id),
                                `Do you wish to remove ${user.email} as an admin?`, 'Do it')}
                        >Remove Admin</Button> :
                            <Button
                                onClick={() => customConfirm(() => makeAdmin(user.id),
                                    `Do you wish to make ${user.email} an admin?`, 'Do it')}
                            >Make Admin</Button>
                        }
                    </td>
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