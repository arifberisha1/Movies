import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import Button from "./Button";

export default function AddRemoveButtons(props: addRemoveButtonsProps) {

    const [option, setOption] = useState<boolean>(false);

    useEffect(() => {
        funk();
    }, [])

    async function funk() {
        const response: AxiosResponse<boolean> =
            await axios.get(`${props.routeURL}/${props.url}/${props.email}/${props.mid}`);
        setOption(response.data);
    }

    return (
        <>
            {!option ?
                <Button className={`btn btn-success ${props.class}`} onClick={() => props.addButton()}>{props.addButtonText}</Button> :
                <Button className={`btn btn-danger ${props.class}`}
                        onClick={() => props.removeButton()}>{props.removeButtonText}</Button>}
        </>
    );
}

interface addRemoveButtonsProps {
    mid: number;
    email: string;
    routeURL: string;
    url: string;
    addButtonText: string;
    removeButtonText: string;
    class?: string;

    addButton(): void;

    removeButton(): void;
}

AddRemoveButtons.defaultProps = {
    class: ''
}