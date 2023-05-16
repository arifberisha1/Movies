import IndexEntity from "../utils/IndexEntity";
import {actorDTO} from "./actors.model";
import {urlActors} from "../endpoints";

export default function IndexActors() {
    return (
        <IndexEntity<actorDTO>
            url={urlActors}
            createURL={'actors/create'}
            title={"Actors"}
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
                            {buttons(`actors/edit/${actor.id}`, actor.id)}
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
    );
}