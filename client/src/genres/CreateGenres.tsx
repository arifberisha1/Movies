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