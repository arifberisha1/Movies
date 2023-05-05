import ActorForm from "./ActorForm";

export default function EditActor() {
    return (
        <>
            <h3>Edit Actor</h3>
            <ActorForm
                model={{
                    name: 'Tom Holland',
                    dateOfBirth: new Date('1996-06-01T00:00:00'),
                    biography: `# Something
                    This person was born in ....`,
                    pictureURL: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTm4a24H7VG_Kd48FtXBaPkt-UazOBq6V14MCzRGtjNV0oqNBIv'
                }}
                onSubmit={values => console.log(values)}/>
        </>
    );
}