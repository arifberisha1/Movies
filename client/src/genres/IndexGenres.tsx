import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {urlGenres} from "../endpoints";
import GenericList from "../utils/GenericList";
import {genreDTO} from "./genres.model";
import Button from "../utils/Button";
import Pagination from "../utils/Pagination";
import RecordsPerPageSelect from "../utils/RecordsPerPageSelect";
import customConfirm from "../utils/customConfirm";

export default function IndexGenres() {

    const [genres, setGenres] = useState<genreDTO[]>();
    const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, recordsPerPage]);

    function loadData(){
        axios.get(urlGenres, {
            params: {page, recordsPerPage}
        })
            .then((response: AxiosResponse<genreDTO[]>) => {
                const totalAmountOfRecords =
                    parseInt(response.headers['totalamountofrecords'], 10);
                setTotalAmountOfPages(Math.ceil(totalAmountOfRecords / recordsPerPage));
                setGenres(response.data);
            })
    }

    async function deleteGenre(id: number){
        try {
            await axios.delete(`${urlGenres}/${id}`);
            loadData();
        }
        catch (error){
            // @ts-ignore
            if (error && error.response){
                // @ts-ignore
                console.error(error.response.data);
            }
        }
    }

    return (
        <>
            <h3>Genres</h3>
            <a href="/genres/create" className={"btn btn-primary"}>Create Genre</a>

            <RecordsPerPageSelect
                onChange={amountOfRecords => {
                    setPage(1);
                    setRecordsPerPage(amountOfRecords);
                }}
            ></RecordsPerPageSelect>

            <Pagination
                currentPage={page}
                totalAmountOfPages={totalAmountOfPages}
                onChange={newPage => setPage(newPage)}></Pagination>

            <GenericList list={genres}>
                <table className={"table table-striped"}>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {genres?.map(genre =>
                        <tr key={genre.id}>
                            <td>
                                <a className={"btn btn-success"}
                                   href={`/genres/edit/${genre.id}`}>Edit</a>
                                <Button
                                    onClick={() => customConfirm(() => deleteGenre(genre.id))}
                                    className={"btn btn-danger"}>Delete</Button>
                            </td>
                            <td>
                                {genre.name}
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </GenericList>
        </>
    );
}