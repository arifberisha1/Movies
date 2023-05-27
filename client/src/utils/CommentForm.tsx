import React from "react";
import TextField from "../forms/TextField";
import Button from "./Button";
import {Form, Formik, FormikHelpers} from "formik";
import {commentFormDTO} from "./comment.model";
import * as Yup from 'yup';

export default function CommentForm(props: commentFormProps) {

    return (
        <Formik
            initialValues={{
                comment: ''
            }}
            onSubmit={(values, actions) => {
                props.onSubmit(values, actions)
            }}
            validationSchema={Yup.object({
                comment: Yup.string().required("This field is required")
            })}
        >

            {(formikProps) => (
                <Form>
                    <TextField field={"comment"} displayName={"Add Comment: "}/>

                    <Button disabled={formikProps.isSubmitting}
                            type={'submit'}
                    >Comment</Button>
                </Form>
            )
            }

        </Formik>
    );
}

interface commentFormProps {
    model: commentFormDTO;

    onSubmit(values: commentFormDTO, actions: FormikHelpers<commentFormDTO>): void;
}