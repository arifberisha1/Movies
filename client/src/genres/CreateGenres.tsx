
import {ErrorMessage, Field, Form, Formik} from "formik";
import Button from "../utils/Button";
import { Link, useHistory} from "react-router-dom";
import * as Yup from 'yup';
import TextField from "../forms/TextField";
import GenreForm from "./GenreForm";

export default function CreateGenres() {



    return (
        <>
            <h3>Create Genre</h3>

            <GenreForm model={{name: ''}}
             onSubmit={async value => {
                await new Promise(r => setTimeout(r, 3));
                console.log(value);

            }}
            />





        </>
    );
}