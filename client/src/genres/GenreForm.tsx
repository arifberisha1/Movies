import * as Yup from "yup";
import {Form, Formik, FormikHelpers} from "formik";
import TextField from "../forms/TextField";
import {Link, useHistory} from "react-router-dom";
import Button from "../utils/Button";
import {genreCreationDTO} from "./genres.model";

export default function GenreForm(props: genreFormProps){
    const history = useHistory();

    return (
        <Formik initialValues={ props.model}
                onSubmit={props.onSubmit}
                validationSchema={Yup.object({
                    name: Yup.string().required('This field is required').firstLetterUppercase()
                })}
        >
            {(formikProps) => (
                <Form>
                    <TextField field="name"  displayName="Name" />

                    <Button  onClick={() => {
                        //todo ... saving in the database


                        // @ts-ignore
                        history.push('/genres');
                        window.location.reload();

                    }}>Save Changes</Button>

                    <a className="btn btn-secondary" href="/genres">Cancel</a>
                </Form>
            )}


        </Formik>


    )
}

interface genreFormProps{
    model: genreCreationDTO;
    onSubmit(values: genreCreationDTO, action: FormikHelpers<genreCreationDTO>): void;
}