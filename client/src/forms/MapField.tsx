import Map from '../utils/Map'
import coordinateDTO from "../utils/coordinates.model";
import {useFormikContext} from "formik";

export default function MapField(props: mapFieldProps){

    const {values} = useFormikContext<any>();

    function handleMapClick(coordinates: coordinateDTO){
        values[props.latField]=coordinates.lat;
        values[props.lngField]=coordinates.lng;
    }

    return (
        <Map
            coordinates={props.coordinates}
            handleMapClick={handleMapClick}
        />
    )
}
interface mapFieldProps{
    coordinates: coordinateDTO[];
    latField: string;
    lngField: string;
}
MapField.defaultProps = {
    coordinate: []
}