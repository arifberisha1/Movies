import {Redirect} from "react-router-dom";

export default function RedirectHome(){
    return <Redirect to={{pathname: "/"}}/>
}