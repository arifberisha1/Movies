import {useEffect, useState} from "react";
import {commentDTO} from "./comment.model";
import axios, {AxiosResponse} from "axios";
import {urlComments} from "../endpoints";
import CommentsList from "./CommentsList";

export default function CommentSection(props: commentSectionProps){

    const [comments, setComments] = useState<commentDTO[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData(){
        try
        {
            await axios.get(`${urlComments}/getByMovieId/${props.movieId}`)
                .then((response: AxiosResponse<commentDTO[]>) => {
                    setComments(response.data);
                });
        }catch (errors){
            // @ts-ignore
            console.log(errors.response.date);
        }
    }

    return(
        <>
            {comments.length > 0 ?
            <CommentsList comments={comments}/>
            : <>There are no comments yet!</>
            }

        </>
    );
}

interface commentSectionProps{
    movieId: number;
}