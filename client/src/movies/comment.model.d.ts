export interface commentDTO{
    id: number,
    userComment: string,
    userEmail: string,
    name: string,
    surname: string,
    movieId: number
}

export interface commentCreationDTO{
    userComment: string,
    userEmail: string,
    movieId: number
}

interface commentFormDTO{
    comment: string
}