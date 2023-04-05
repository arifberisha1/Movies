export default function Menu() {
    return (
        <nav className={'navbar navbar-expand-lg navbar-light bg-light'}>
            <div className={"container-fluid"}>

                <table className={"tab"}>
                    <thead>
                        <tbody><a href={'/'}>Home</a></tbody>
                        <tbody><a href={'/movies'}>Movies</a></tbody>
                        <tbody><a href={'/actors'}>Actors</a></tbody>
                    </thead>
                </table>

            </div>

        </nav>
    );
}