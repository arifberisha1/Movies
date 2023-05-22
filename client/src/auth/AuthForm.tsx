import {userCredentials} from "./auth.models";
import {Form, Formik, FormikHelpers} from "formik";
import * as Yup from 'yup';
import TextField from "../forms/TextField";
import Button from "../utils/Button";

export default function AuthForm(props: authFormProps) {
    return (
        <Formik initialValues={props.model}
                onSubmit={props.onSubmit}
                validationSchema={Yup.object({
                    email: Yup.string().required('This field is required')
                        .email('You have to insert a valid email'),
                    password: Yup.string().required('This field is required')
                })}
        >
            {formikProps => (
                <Form>
                    <TextField field={"email"} displayName={"Email"}/>
                    <TextField field={"password"} displayName={"Password"} type={"password"}/>

                    <Button disabled={formikProps.isSubmitting} type={"submit"}>Send</Button>
                    <a href="/" className={"btn btn-secondary"}>Cancel</a>
                </Form>
            )}
        </Formik>
    );
}

interface authFormProps {
    model: userCredentials;

    onSubmit(values: userCredentials, actions: FormikHelpers<userCredentials>): void;
}