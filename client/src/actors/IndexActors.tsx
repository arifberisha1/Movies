import IndexEntity from "../utils/IndexEntity";
import {actorDTO, typeaheadActors} from "./actors.model";
import {urlActors} from "../endpoints";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import AuthenticationContext from "../auth/AuthenticationContext";
import {Typeahead} from "react-bootstrap-typeahead";
import {Link, useNavigate} from "react-router-dom";
import axios, {AxiosResponse} from "axios";

export default function IndexActors() {

    const {claims} = useContext(AuthenticationContext);
    const navigate = useNavigate();
    const [taActors, setTaActors] = useState<typeaheadActors[]>([]);

    useEffect(() => {
        getTypeaheadData();
    }, []);

    async function getTypeaheadData() {
        try {
            const response: AxiosResponse<typeaheadActors[]> = await axios.get(`${urlActors}/typeahead`);
            setTaActors(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    function isAdmin() {
        var admin = false;
        claims.map(claim => {
            if (claim.name === 'role' && claim.value === 'admin') {
                admin = true;
            }
        })
        return admin;
    }

    return (
        <>

            <h3>Actors</h3>

            <Typeahead
                className={"typeahead"}
                id="selections-example"
                labelKey="name"
                onInputChange={(text: string, e: ChangeEvent<HTMLInputElement>) => {
                    console.log(text, e);
                }}
                options={taActors}
                placeholder="Search actors..."
                onChange={(selected: any[]) => {
                    const clickedActor = selected[0];
                    if (clickedActor) {
                        navigate(`/actors/details/${clickedActor.id}`);
                    }
                }}
                renderMenuItemChildren={actor => (
                    <>
                        <img src={
                            // @ts-ignore
                            actor.picture} alt="actor"
                             style={{
                                 height: '64px',
                                 marginRight: '10px',
                                 width: '64px'
                             }}/>
                        <span>{
                            // @ts-ignore
                            actor.name}</span>
                    </>
                )}
            />
            <IndexEntity<actorDTO>
                url={urlActors}
                createURL={isAdmin() ? '/actors/create' : ''}
                title={""}
                entityName={"Actor"}>
                {(actors, buttons) =>
                    <>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Image</th>
                        </tr>
                        </thead>
                        <tbody>
                        {actors?.map(actor => <tr key={actor.id}>
                            <td>
                                {isAdmin() ? buttons(`/actors/edit/${actor.id}`, actor.id) : null}
                                <Link to={`/actors/details/${actor.id}`} className={"btn btn-dark ms-3"}>More</Link>
                            </td>
                            <td>
                                {actor.name}
                            </td>
                            <td>
                                <img src={actor.picture} alt={actor.name}
                                     className={"img-actor"}/>
                            </td>
                        </tr>)}
                        </tbody>
                    </>}
            </IndexEntity>
        </>
    );
}