import {userCredentials} from "./auth.models";
import {Form, Formik, FormikHelpers} from "formik";
import * as Yup from 'yup';
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import {useNavigate} from "react-router-dom";

export default function AuthFormLogin(props: authFormProps) {

    const navigate = useNavigate();

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

                    <Button disabled={formikProps.isSubmitting} type={"submit"}>Log in</Button>
                    <Button onClick={() => {
                        navigate(-1);
                    }} className={"btn btn-secondary ms-3"}>Cancel</Button>
                </Form>
            )}
        </Formik>
    );
}

interface authFormProps {
    model: userCredentials;

    onSubmit(values: userCredentials, actions: FormikHelpers<userCredentials>): void;
}