import {actorMovieDTO} from "../actors/actors.model";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {ReactElement, useState} from "react";
import Swal from "sweetalert2";
import axios, {AxiosResponse} from "axios";
import {urlActors} from "../endpoints";

export default function TypeAheadActors(props: typeAheadActorsProps) {

    const [actors, setActors] = useState<actorMovieDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const selected: actorMovieDTO[] = [];
    const [draggedElement, setDraggedElement] = useState<actorMovieDTO | undefined>(undefined);

    function handleSearch (query: string){
        setIsLoading(true);

        axios.get(`${urlActors}/searchByName/${query}`)
            .then((response: AxiosResponse<actorMovieDTO[]>) => {
                setActors(response.data);
                setIsLoading(false);
            })
    }

    function handleDragStart(actor: actorMovieDTO) {
        setDraggedElement(actor);
    }

    function handleDragOver(actor: actorMovieDTO) {
        if (!draggedElement) {
            return;
        }
        if (actor.id !== draggedElement.id) {
            const draggedElementIndex = props.actors.findIndex(x => x.id === draggedElement.id);
            const actorIndex = props.actors.findIndex(x => x.id === actor.id);

            const actors = [...props.actors];
            actors[actorIndex] = draggedElement;
            actors[draggedElementIndex] = actor;
            props.onAdd(actors);
        }
    }

    return (
        <div className={"mb-3"}>
            <label>{props.displayName}</label>
            <AsyncTypeahead
                id={"typeahead"}
                onChange={actors => {
                    // @ts-ignore
                    if (props.actors.findIndex(x => x.id === actors[0].id) === -1) {
                        // @ts-ignore
                        actors[0].character = '';
                        // @ts-ignore
                        props.onAdd([...props.actors, actors[0]]);
                    }
                }}
                options={actors}
                labelKey={
                    // @ts-ignore
                    actor => actor.name}
                filterBy={() => true}
                isLoading={isLoading}
                onSearch={handleSearch}
                placeholder={"Write the name of the actor..."}
                minLength={1}
                flip={true}
                selected={selected}
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
            <ul className={"list-group"}>
                {props.actors.map(actor => <li
                    key={actor.id}
                    draggable={true}
                    onDragStart={() => handleDragStart(actor)}
                    onDragOver={() => handleDragOver(actor)}
                    className={"list-group-item list-group-item-action"}>
                    <img src={actor.picture} alt={actor.name} className={"img-drag"}/>
                    {props.listUI(actor)}
                    <span className={"badge badge-primary badge-pill pointer text-dark"}
                          style={{marginLeft: '0.5rem'}}
                          onClick={() => props.onRemove(actor)}
                    >X</span>
                </li>)}
            </ul>
        </div>
    )
}

interface typeAheadActorsProps {
    displayName: string;
    actors: actorMovieDTO[];

    onAdd(actors: actorMovieDTO[]): void;

    onRemove(actor: actorMovieDTO): void;

    listUI(actor: actorMovieDTO): ReactElement;
}