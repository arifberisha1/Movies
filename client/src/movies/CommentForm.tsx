import React, {useContext} from "react";
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import {Form, Formik, FormikHelpers} from "formik";
import {commentDTO, commentFormDTO} from "./comment.model";

export default function CommentForm(props: commentFormProps) {

    return (
        <Formik
            initialValues={{
                comment: ''
            }}
            onSubmit={(values, actions) => {
                props.onSubmit(values, actions)
            }}>

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