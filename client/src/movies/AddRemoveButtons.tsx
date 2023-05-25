import {useContext, useEffect, useState} from "react";
import AuthenticationContext from "../auth/AuthenticationContext";
import axios, {AxiosResponse} from "axios";
import {urlFavourite} from "../endpoints";
import Button from "../utils/Button";

export default function AddRemoveButtons(props: addRemoveButtonsProps) {

    const {claims} = useContext(AuthenticationContext);
    const [option, setOption] = useState<boolean>(false);

    useEffect(() => {
        funk();
    }, [])

    async function funk() {
        const response: AxiosResponse<boolean> =
            await axios.get(`${urlFavourite}/${props.url}/${props.email}/${props.mid}`);
        setOption(response.data);
    }

    return (
        <>
            {!option ?
                <Button className={"btn btn-success"} onClick={() => props.addButton()}>{props.addButtonText}</Button> :
                <Button className={"btn btn-danger"}
                        onClick={() => props.removeButton()}>{props.removeButtonText}</Button>}
        </>
    );
}

interface addRemoveButtonsProps {
    mid: number;
    email: string;
    url: string;
    addButtonText: string,
    removeButtonText: string,

    addButton(): void;

    removeButton(): void;
}