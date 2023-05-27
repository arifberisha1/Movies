import {editUser} from "./auth.models";
import {Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import React from "react";
import DateField from "../forms/DateField";
import {useNavigate} from "react-router-dom";

export default function EditUserForm(props: editUserFormProps) {

    const navigate = useNavigate();

    return (
        <>
            <Formik
                initialValues={props.model}
                onSubmit={props.onSubmit}
                validationSchema={Yup.object({
                    name: Yup.string().required("This field is required").firstLetterUppercase(),
                    surname: Yup.string().required("This field is required").firstLetterUppercase(),
                    birthday: Yup.date().required("This field is required"),
                    gender: Yup.string().required("This field is required").firstLetterUppercase(),
                    address: Yup.string().required("This field is required").firstLetterUppercase()
                })}
            >
                {formikProps => (
                    <Form>

                        <TextField field={"name"} displayName={"Name"} type={"text"}/>
                        <TextField field={"surname"} displayName={"Surname"} type={"text"}/>
                        <DateField field={"birthday"} displayName={"Birthday"}/>
                        <TextField field={"gender"} displayName={"Gender"} type={"text"}/>
                        <TextField field={"address"} displayName={"Address"} type={"text"}/>

                        <Button disabled={formikProps.isSubmitting} type={"submit"}>Edit</Button>
                        <Button onClick={() => {
                            navigate(-1);
                        }} className={"btn btn-secondary ms-3"}>Cancel</Button>
                    </Form>
                )}
            </Formik>
        </>
    );
}

interface editUserFormProps {
    model: editUser;

    onSubmit(values: editUser, actions: FormikHelpers<editUser>): void;
}