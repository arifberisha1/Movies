import {Form, Formik, FormikHelpers} from "formik";
import TextField from "../forms/TextField";
import Button from "../utils/Button";
import * as Yup from 'yup';
import MapField from "../forms/MapField";
import coordinateDTO from "../utils/coordinates.model";
import {movieTheaterCreationDTO} from "./movieTheater.model";

export default function MovieTheaterForm(props: movieTheaterFormsProps) {
    function transformCoordinates(): coordinateDTO[] | null {
        if (props.model.latitude && props.model.longitude) {
            const response: coordinateDTO = {
                lat: props.model.latitude,
                lng: props.model.longitude
            }
            return [response];
        }
        return null;
    }

    return (
        <Formik
            initialValues={props.model}
            onSubmit={props.onSubmit}
            validationSchema={Yup.object({
                name: Yup.string().required('This field is required').firstLetterUppercase()
            })}>
            {(formikProps) => (
                <Form>
                    <TextField field={"name"} displayName={"Name"}/>

                    <div style={{marginBottom: '1rem'}}>
                        <MapField latField={'latitude'} lngField={'longitude'}
                                  coordinates={transformCoordinates() || []}/>
                    </div>
                    <Button disabled={formikProps.isSubmitting} type={"submit"}>
                        Save Changes
                    </Button>
                    <a className={"btn btn-secondary"} href={'/movietheaters'}>Cancel</a>
                </Form>
            )}
        </Formik>
    )
}

interface movieTheaterFormsProps {
    model: movieTheaterCreationDTO;

    onSubmit(values: movieTheaterCreationDTO, action: FormikHelpers<movieTheaterCreationDTO>): void;
}