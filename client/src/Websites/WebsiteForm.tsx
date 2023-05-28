import {websiteCreationDTO} from "./website.model";
import {Form, Formik, FormikHelpers} from "formik";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import TextField from "../forms/TextField";
import ImageField from "../forms/ImageField";
import Button from "../utils/Button";

export default function WebsiteForm(props: websiteFormProps) {

    const navigate = useNavigate();

    return (
        <Formik initialValues={props.model}
                onSubmit={props.onSubmit}
                validationSchema={Yup.object({
                    name: Yup.string().required("This field is required").firstLetterUppercase(),
                    link: Yup.string().required("This field is required")
                })}>

            {(formikProps) => (
                <Form>
                    <TextField field={"name"} displayName={"Name"}/>
                    <TextField field={"link"} displayName={"Link"}/>
                    <ImageField field={"picture"} displayName={"Picture"}/>
                    <Button disabled={formikProps.isSubmitting} type={"submit"}>Save Changes</Button>
                    <Button onClick={() => {
                        navigate(-1);
                    }} className={"btn btn-secondary ms-3"}>Cancel</Button>
                </Form>
            )}

        </Formik>
    );
}

interface websiteFormProps {
    model: websiteCreationDTO;

    onSubmit(values: websiteCreationDTO, action: FormikHelpers<websiteCreationDTO>): void;
}