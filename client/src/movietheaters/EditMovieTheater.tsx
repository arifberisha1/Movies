import MovieTheaterForm from "./MovieTheaterForm";

export default function EditMovieTheater() {
    return (
        <>
            <h3>Edit Movie Theater</h3>
            <MovieTheaterForm
                model={{name: 'Albi Mall', latitude: 42.648630, longitude: 21.167109}}
                onSubmit={values => console.log(values)}
            />
        </>
    );
}