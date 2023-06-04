import {websiteCreationDTO, websiteDTO} from "./website.model";
import EditEntity from "../utils/EditEntity";
import {urlServer, urlWebsite} from "../endpoints";
import {convertWebsiteToFormData} from "../utils/formDataUtils";
import WebsiteForm from "./WebsiteForm";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function EditWebsite() {

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

    function transform(website: websiteDTO): websiteCreationDTO {
        return {
            name: website.name,
            link: website.link,
            pictureURL: website.picture
        }
    }

    return (
        <EditEntity<websiteCreationDTO, websiteDTO>
            url={urlWebsite}
            indexURL={"/websites"}
            entityName={"Website"}
            transformFormData={convertWebsiteToFormData}
            transform={transform}
        >

            {(entity, edit) =>
                <WebsiteForm model={entity}
                             onSubmit={async values => await edit(values)}/>
            }

        </EditEntity>
    );
}