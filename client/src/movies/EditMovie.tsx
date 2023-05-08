import MovieForm from "./MovieForm";
import {genreDTO} from "../genres/genres.model";
import {movieTheaterDTO} from "../movietheaters/movieTheater.model";
import {actorMovieDTO} from "../actors/actors.model";


export default function EditMovie() {

    const  nonSelectedGenres: genreDTO[] = [{id:2, name:'Drama'}]
    const  selectedGenres: genreDTO[] = [{id:1, name: 'Comedy'}]

    const  nonSelectedMovieTheaters: movieTheaterDTO[] =
        [{id:2, name:'Prishtina Mall'}]

    const  selectedMovieTheaters: movieTheaterDTO[] =
        [{id:1, name: 'Albi Mall'}]

    const selectedActors: actorMovieDTO[] = [{
        id: 1,
        name: 'Felipe',
        character: 'Geralt',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tom_Holland_by_Gage_Skidmore.jpg/330px-Tom_Holland_by_Gage_Skidmore.jpg'
    }]

    return (
        <>
            <h3>Edit Movie</h3>
            <MovieForm model={{title: 'Toy Story', inTheaters: false, trailer: 'url',
            releaseDate: new Date('2019-01-01T00:00:00')
            }}
                       onSubmit={values => console.log(values)}
                       nonSelectedGenres={nonSelectedGenres}
                       selectedGenres={selectedGenres}

                       nonSelectedMovieTheaters={nonSelectedMovieTheaters}
                       selectedMovieTheaters={selectedMovieTheaters}
                       selectedActors={selectedActors}

            />
        </>

    );
}