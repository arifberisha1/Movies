import GenericList from "../utils/GenericList";
import {commentDTO} from "./comment.model";

export default function CommentsList(props: commentListProps){
    return(
        <GenericList list={props.comments}>
            <div>

                {props.comments?.map(comment =>
                    <div key={comment.id} className={"comment-container"}>
                        <p className={"comment-man"}>{comment.name} {comment.surname}</p>
                        <div className={"comment-section"}>
                        {comment.userComment}
                        </div>
                    </div>
                )}

            </div>
        </GenericList>
    );
}

interface commentListProps{
    comments?: commentDTO[];
}