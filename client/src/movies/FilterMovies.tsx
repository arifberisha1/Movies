import {Field, Form, Formik} from "formik";
import React, {useEffect, useState} from "react";
import {genreDTO} from "../genres/genres.model";
import Button from "../utils/Button";
import axios, {AxiosResponse} from "axios";
import {urlGenres, urlMovies} from "../endpoints";
import {movieDTO} from "./movies.model";
import MoviesList from "./MoviesList";
import {useHistory, useLocation} from "react-router-dom";
import Pagination from "../utils/Pagination";

export default function FilterMovies() {
    const initialValuesForm: filterMoviesForm = {
        title: '',
        genreId: 0,
        upcomingReleases: false,
        inTheaters: false,
        page: 1,
        recordsPerPage: 10
    };

    const initialValuesStart: filterMoviesForm = {
        title: "_",
        genreId: initialValuesForm.genreId,
        upcomingReleases: initialValuesForm.upcomingReleases,
        inTheaters: initialValuesForm.inTheaters,
        page: initialValuesForm.page,
        recordsPerPage: initialValuesForm.recordsPerPage
    }

    // const genres: genreDTO[] = [{id: 1, name: "Drama"}, {id: 2, name: "Comedy"}]
    const [genres, setGenres] = useState<genreDTO[]>([]);
    const [movies, setMovies] = useState<movieDTO[]>([]);
    const history = useHistory();
    const query = new URLSearchParams(useLocation().search);
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0)

    useEffect(() => {
        axios.get(`${urlGenres}/all`)
            .then((response: AxiosResponse<genreDTO[]>) => {
                setGenres(response.data);
            })
    }, []);

    useEffect(() => {

        if (query.get('title')) {
            initialValuesForm.title = query.get('title')!;
        }

        if (query.get('genreId')) {
            initialValuesForm.genreId = parseInt(query.get('genreId')!, 10);
        }

        if (query.get('upcomingReleases')) {
            initialValuesForm.upcomingReleases = true;
        }

        if (query.get('inTheaters')) {
            initialValuesForm.inTheaters = true;
        }

        if (query.get('page')) {
            initialValuesForm.page = parseInt(query.get('page')!, 10);
        }

        if (query.get('title')){
            searchMovies(initialValuesForm);
        }else {
        searchMovies(initialValuesStart);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function searchMovies(values: filterMoviesForm) {
        modifyURL(values);
        axios.get(`${urlMovies}/filter`, {params: values})
            .then((response: AxiosResponse<movieDTO[]>) => {
                const records = parseInt(response.headers['totalamountofrecords'], 10);
                setTotalAmountOfPages(Math.ceil(records / values.recordsPerPage));
                setMovies(response.data);
            })
    }

    function modifyURL(values: filterMoviesForm) {
        const queryString: string[] = [];

        if (values.title && values.title !== "_") {
            queryString.push(`title=${values.title}`);
        }

        if (values.genreId !== 0) {
            queryString.push(`genreId=${values.genreId}`);
        }

        if (values.upcomingReleases) {
            queryString.push(`upcomingReleases=${values.upcomingReleases}`);
        }

        if (values.inTheaters) {
            queryString.push(`inTheaters=${values.inTheaters}`);
        }

        queryString.push(`page=${values.page}`);
        history.push(`/movies/filter?${queryString.join('&')}`);
    }

    return (
        <>
            <h3>Filter Movies</h3>
            <Formik initialValues={initialValuesForm}
                    onSubmit={values => {
                        values.page = 1;
                        if (values.title && values.title.trim()) {
                            searchMovies(values);
                        } else {
                            searchMovies({
                                title: "_",
                                genreId: values.genreId,
                                upcomingReleases: values.upcomingReleases,
                                inTheaters: values.inTheaters,
                                page: values.page,
                                recordsPerPage: values.recordsPerPage
                            })
                        }
                    }}>
                {(formikProps) => (
                    <>
                        <Form>
                            <div className={"row gx-3 align-items-center mb-3"}>
                                <div className={"col-auto"}>
                                    <input type="text" className={"form-control"} id={"title"}
                                           placeholder={"Title of the movie"}
                                           {...formikProps.getFieldProps("title")}
                                    />
                                </div>
                                <div className={"col-auto"}>
                                    <select className={"form-select"}
                                            {...formikProps.getFieldProps("genreId")}>
                                        <option value="0">--Chose a genre--</option>
                                        {genres.map(genre => <option key={genre.id}
                                                                     value={genre.id}
                                        >{genre.name}</option>)}
                                    </select>
                                </div>
                                <div className={"col-auto"}>
                                    <div className={"form-check"}>
                                        <Field className={"form-check-input"} id={"upcomingReleases"}
                                               name={"upcomingReleases"} type={"checkbox"}/>
                                        <label htmlFor={"upcomingReleases"}
                                               className={"form-check-label"}>Upcoming Releases</label>
                                    </div>
                                </div>
                                <div className={"col-auto"}>
                                    <div className={"form-check"}>
                                        <Field className={"form-check-input"} id={"inTheaters"}
                                               name={"inTheaters"} type={"checkbox"}/>
                                        <label htmlFor={"inTheaters"}
                                               className={"form-check-label"}>In Theaters</label>
                                    </div>
                                </div>
                                <div className={"col-auto"}>
                                    <Button
                                        onClick={() => formikProps.submitForm()}
                                        className={"btn btn-primary"}>Filter
                                    </Button>
                                    <Button className={"btn btn-danger ms-3"}
                                        onClick={() => {
                                            formikProps.setValues(initialValuesForm);
                                            searchMovies(initialValuesStart);
                                        }}
                                    >Clear</Button>
                                </div>
                            </div>
                        </Form>
                        {movies.length === 0 ? <div>There are no movies matching your search!</div> :
                            <MoviesList movies={movies}/>}

                        <Pagination totalAmountOfPages={totalAmountOfPages}
                                    currentPage={formikProps.values.page}
                                    onChange={newPage => {
                                        formikProps.values.page = newPage;
                                        searchMovies(formikProps.values);
                                    }}
                        />
                    </>
                )}
            </Formik>
        </>
    );
}

interface filterMoviesForm {
    title: string;
    genreId: number;
    upcomingReleases: boolean;
    inTheaters: boolean;
    page: number;
    recordsPerPage: number;
}