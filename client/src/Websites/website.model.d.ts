export interface websiteDTO {
    id: number;
    name: string;
    link: string;
    picture: string;
}

export interface websiteCreationDTO {
    name: string;
    link: string;
    picture?: File;
    pictureURL?: string;
}