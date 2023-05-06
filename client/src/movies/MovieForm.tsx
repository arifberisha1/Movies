import {Formik, Form, FormikHelpers} from "formik";
import movieTheaterCreationDTO, {movieTheaterDTO} from "../movietheaters/movieTheater.model";
import {movieCreationDTO} from "./movies.model";
import * as Yup from 'yup';
import Button from "../utils/Button";
import ImageField from "../forms/ImageField";
import TextField from "../forms/TextField";
import DateField from "../forms/DateField";
import CheckboxField from "../forms/CheckboxField";
import {useHistory} from "react-router-dom";
import MultipleSelector, {multipleSelectorModel} from "../forms/MultipleSelector";
import {useState} from "react";
import {genreDTO} from "../genres/genres.model";

export default function MovieForm(props: movieFormProps) {
    const history = useHistory();

    const [selectedGenres, setSelectedGenres]
        = useState(mapToModel(props.selectedGenres));
    const [nonSelectedGenres, setNonSelectedGenres]
        = useState(mapToModel(props.nonSelectedGenres));

    const [selectedMovieTheaters, setSelectedMovieTheaters]
        = useState(mapToModel(props.selectedMovieTheaters));
    const [nonSelectedMovieTheaters, setNonSelectedMovieTheaters]
        = useState(mapToModel(props.nonSelectedMovieTheaters));

    function mapToModel(items: {id: number, name: string}[]): multipleSelectorModel[]{
        return items.map(item => {
            return  {key: item.id, value: item.name}
        })
    }

    return  (
        <Formik
        initialValues={props.model}
        onSubmit={(values, actions) => {
            values.genresIds = selectedGenres.map(item => item.key);
            values.movieTheatersIds = selectedMovieTheaters.map(item => item.key);
            props.onSubmit(values, actions)
        }}
        validationSchema={Yup.object({
            title: Yup.string().required('This field is required').firstLetterUppercase()
        })}
        >
            {(formikProps) => (
                <Form>

                    <TextField displayName="Title" field="title" />
                    <CheckboxField displayName="In Theaters" field="inTheaters" />
                    <TextField displayName="Trailer" field="trailer" />
                    <DateField displayName="Release Date" field="releaseDate" />
                    <ImageField field="poster" displayName="Poster" imageURL={props.model.posterURL}/>


                    <MultipleSelector
                    displayName="Genres"
                    nonSelected={nonSelectedGenres}
                    selected={selectedGenres}
                    onChange={(selected, nonSelected) =>{

                        setSelectedGenres(selected);
                        setNonSelectedGenres(nonSelected);
                    }}
                    />

                    <MultipleSelector
                        displayName="Movie Theaters"
                        nonSelected={nonSelectedMovieTheaters}
                        selected={selectedMovieTheaters}
                        onChange={(selected, nonSelected) =>{

                            setSelectedMovieTheaters(selected);
                            setNonSelectedMovieTheaters(nonSelected);
                        }}
                    />

                    <Button  onClick={() => {
                        //todo ... saving in the database


                        // @ts-ignore
                        history.push('/genres');
                        window.location.reload();

                    }}>Save Changes</Button>

                    <a className="btn btn-secondary" href="/genres">Cancel</a>
                </Form>

            )}
        </Formik>
    )
}

interface movieFormProps {
model: movieCreationDTO;
onSubmit(values: movieCreationDTO, actions: FormikHelpers<movieCreationDTO>): void;
selectedGenres: genreDTO[];
nonSelectedGenres: genreDTO[];
selectedMovieTheaters: movieTheaterDTO[];
nonSelectedMovieTheaters: movieTheaterDTO[];
}
