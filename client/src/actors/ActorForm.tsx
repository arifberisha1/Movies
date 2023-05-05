import {Form, Formik, FormikHelpers} from "formik";
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import {actorCreationDTO} from "./actors.model";
import * as Yup from 'yup'

export default function ActorForm(props: actorFormProps) {
    return (
        <Formik initialValues={props.model}
                onSubmit={props.onSubmit}
                validationSchema={Yup.object({
                    name: Yup.string().required('This field is required').firstLetterUppercase()
                })}
        >

            {(formikProps) =>(
                <Form>
                    <TextField
                        field={"name"}
                        displayName={"Name"}/>

                    <Button disabled={formikProps.isSubmitting} type={"submit"} >Save Changes</Button>
                    <a href={"/actors"} className={"btn btn-secondary"} >Cancel</a>
                </Form>
            )}

        </Formik>
    )
}

interface actorFormProps {
    model: actorCreationDTO;
    onSubmit(values: actorCreationDTO, action: FormikHelpers<actorCreationDTO>): void;
}