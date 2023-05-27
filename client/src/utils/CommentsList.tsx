import GenericList from "./GenericList";
import {commentDTO} from "./comment.model";
import axios, {AxiosResponse} from "axios";
import Swal from "sweetalert2";
import {urlComments} from "../endpoints";
import {useContext} from "react";
import AuthenticationContext from "../auth/AuthenticationContext";
import Button from "./Button";

export default function CommentsList(props: commentListProps) {

    const {claims} = useContext(AuthenticationContext);

    function getEmail() {
        var email = '';
        claims.map(claim => {
            if (claim.name === 'email') {
                email = claim.value;
            }
        })
        return email;
    }

    function isAdmin() {
        var admin = false
        claims.map(claim => {
            if (claim.name === 'role' && claim.value === 'admin') {
                admin = true;
            }
        })
        return admin;
    }

    async function deleteComment(id: number) {

        await Swal.fire({
            title: 'Confirmation',
            text: 'Are you sure you want to delete this comment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${urlComments}/delete/${id}`)
                    .then((response: AxiosResponse) => {
                        Swal.fire({
                            title: 'Success',
                            text: response.data,
                            icon: 'success'
                        }).then(() => {
                            window.location.reload();
                        });
                    });
            }
        });
    }

    return (
        <GenericList list={props.comments}>
            <div>
                {props.comments?.map(comment =>
                    <div key={comment.id} className={"comment-container"}>
                        {getEmail() === comment.userEmail || isAdmin() ?
                            <Button className={"delete-comment"}
                                    onClick={async () => deleteComment(comment.id)}
                            >X</Button> : null
                        }
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

interface commentListProps {
    comments?: commentDTO[];
}