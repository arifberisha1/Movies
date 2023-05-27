import {changePasswordForm} from "./auth.models";
import {Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import {useNavigate} from "react-router-dom";

export default function ChangePasswordForm(props: changePasswordFormProps) {

    const navigate = useNavigate();

    return (
        <>
            <Formik initialValues={props.model}
                    onSubmit={props.onSubmit}
                    validationSchema={Yup.object({
                        oldPassword: Yup.string().required('This field is required'),
                        newPassword: Yup.string().required('This field is required'),
                        confirmNewPassword: Yup.string().required('This field is required')
                    })}
            >
                {formikProps => (
                    <Form>

                        <TextField field={"oldPassword"} displayName={"Old password"} type={"password"}/>
                        <TextField field={"newPassword"} displayName={"New password"} type={"password"}/>
                        <TextField field={"confirmNewPassword"} displayName={"Confirm new password"} type={"password"}/>

                        <Button disabled={formikProps.isSubmitting} type={"submit"}>Change Password</Button>
                        <Button onClick={() => {
                            navigate(-1);
                        }} className={"btn btn-secondary ms-3"}>Cancel</Button>
                    </Form>
                )}
            </Formik>
        </>
    );
}

interface changePasswordFormProps {
    model: changePasswordForm;

    onSubmit(values: changePasswordForm, actions: FormikHelpers<changePasswordForm>): void;
}