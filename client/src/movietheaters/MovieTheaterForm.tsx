import {Form, Formik, FormikHelpers} from "formik";
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import {movieTheaterCreationDTO} from "./movieTheater.model";
import * as Yup from 'yup';

export default function MovieTheaterForm(props: movieTheaterForm){
    return (
        <Formik
            initialValues={props.model}
            onSubmit={props.onSubmit}
            validationSchema={Yup.object({
                name: Yup.string().required('This field is required').firstLetterUppercase()
            })}
        >
            {(formikProps) => (
                <Form>
                    <TextField displayName="Name" field="name"/>

                    <Button disabled={formikProps.isSubmitting} type="submit">Save Changes
                    </Button>

                    <a href="/movietheaters" className="btn btn-secondary">Cancel</a>
                </Form>
            )}
        </Formik>
    )
}
interface movieTheaterForm{
    model: movieTheaterCreationDTO;
    onSubmit(values: movieTheaterCreationDTO, action: FormikHelpers<movieTheaterCreationDTO>):void;
}