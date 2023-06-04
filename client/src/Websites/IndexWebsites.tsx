import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import AuthenticationContext from "../auth/AuthenticationContext";
import IndexEntity from "../utils/IndexEntity";
import {websiteDTO} from "./website.model";
import {urlServer, urlWebsite} from "../endpoints";
import axios, {AxiosResponse} from "axios";
import {Typeahead} from "react-bootstrap-typeahead";
import {useNavigate} from "react-router-dom";

export default function IndexWebsites() {

    const {claims} = useContext(AuthenticationContext);
    const [taWebsites, setTaWensites] = useState<websiteDTO[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        isRunning();
    })

    async function isRunning() {
        try {
            await axios.get(`${urlServer}/running`);
        } catch (error) {
            navigate(0);
        }
    }

    useEffect(() => {
        getTypeaheadData();
    }, []);

    async function getTypeaheadData() {
        try {
            const response: AxiosResponse<websiteDTO[]> = await axios.get(`${urlWebsite}`);
            setTaWensites(response.data);
        } catch (error) {
            console.log(error);
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
            <h3>Websites</h3>

            <Typeahead
                className={"typeahead"}
                id="selections-example"
                labelKey="name"
                onInputChange={(text: string, e: ChangeEvent<HTMLInputElement>) => {
                    console.log(text, e);
                }}
                options={taWebsites}
                placeholder={"Search websites..."}
                onChange={(selected: any[]) => {
                    const clickedWebsite = selected[0];
                    if (clickedWebsite) {
                        window.open(clickedWebsite.link, '_blank');
                    }
                }}
                renderMenuItemChildren={website => (
                    <>
                        <img src={
                            // @ts-ignore
                            website.picture} alt="website"
                             style={{
                                 height: '64px',
                                 marginRight: '10px',
                                 width: '64px'
                             }}/>
                        <span>{
                            // @ts-ignore
                            website.name}</span>
                    </>
                )}
            />

            <IndexEntity<websiteDTO>
                url={urlWebsite}
                createURL={isAdmin() ? '/websites/create' : ''}
                title={""}
                entityName={"Website"}>
                {(websites, buttons) =>
                    <>
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Link</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {websites?.map(website => <tr key={website.id}>
                            <td>
                                <img src={website.picture} alt={website.name}
                                     className={"img-actor"}/>
                            </td>
                            <td>
                                {website.name}
                            </td>
                            <td>
                                <a href={website.link} target={"_blank"}>Visit</a>
                            </td>
                            <td>
                                {isAdmin() ? buttons(`/websites/edit/${website.id}`, website.id) : null}
                            </td>
                        </tr>)}
                        </tbody>
                    </>}
            </IndexEntity>
        </>
    );
}