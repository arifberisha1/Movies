import * as Yup from "yup";
import {Form, Formik, FormikHelpers} from "formik";
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import {genreCreationDTO} from "./genres.model";

export default function GenreForm(props: genreFormProps) {

    return (
        <Formik initialValues={props.model}
                onSubmit={props.onSubmit}
                validationSchema={Yup.object({
                    name: Yup.string().required('This field is required')
                    .max(50, "Max length is 50 characters").firstLetterUppercase()
                })}>
            {(formikProps) => (
                <Form>
                    <TextField field="name" displayName="Name"/>

                    <Button disabled={formikProps.isSubmitting} type={'submit'}>Save Changes</Button>
                    <a className="btn btn-secondary" href="/genres">Cancel</a>
                </Form>
            )}
        </Formik>
    )
}

interface genreFormProps {
    model: genreCreationDTO;

    onSubmit(values: genreCreationDTO, action: FormikHelpers<genreCreationDTO>): void;
}