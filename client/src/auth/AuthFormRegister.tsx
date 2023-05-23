import {userDetails} from "./auth.models";
import {Form, Formik, FormikHelpers} from "formik";
import * as Yup from 'yup';
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import DateField from "../forms/DateField";

export default function AuthFormLogin(props: authFormProps) {
    return (
        <Formik initialValues={props.model}
                onSubmit={props.onSubmit}
                validationSchema={Yup.object({
                    email: Yup.string().required('This field is required')
                        .email('You have to insert a valid email'),
                    password: Yup.string().required('This field is required'),
                    confirmPassword: Yup.string().required('This field is required'),
                    name: Yup.string().required('This field is required'),
                    surname: Yup.string().required('This field is required'),
                    birthday: Yup.date().required('This field is required'),
                    gender: Yup.string().required('This field is required'),
                    address: Yup.string().required('This field is required')
                })}
        >
            {formikProps => (
                <Form>
                    <TextField field={"email"} displayName={"Email"}/>
                    <TextField field={"password"} displayName={"Password"} type={"password"}/>
                    <TextField field={"confirmPassword"} displayName={"Confirm Password"} type={"password"}/>
                    <TextField field={"name"} displayName={"Name"} type={"text"}/>
                    <TextField field={"surname"} displayName={"Surname"} type={"text"}/>
                    <DateField field={"birthday"} displayName={"Birthday"}/>
                    <TextField field={"gender"} displayName={"Gender"} type={"text"}/>
                    <TextField field={"address"} displayName={"Address"} type={"text"}/>

                    <Button disabled={formikProps.isSubmitting} type={"submit"}>Register</Button>
                    <a href="/" className={"btn btn-secondary"}>Cancel</a>
                </Form>
            )}
        </Formik>
    );
}

interface authFormProps {
    model: userDetails;

    onSubmit(values: userDetails, actions: FormikHelpers<userDetails>): void;
}