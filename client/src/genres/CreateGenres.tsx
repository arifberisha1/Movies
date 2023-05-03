import Button from "../utils/Button";
import {useHistory} from "react-router-dom";

export default function CreateGenres() {

    const history = useHistory();

    return (
        <>
            <h3>Create Genre</h3>
            <Button onClick={() => {
                //todo ... saving in the database

                history.push('/genres');
                window.location.reload();

            }}>Save Changes</Button>
        </>
    );
}