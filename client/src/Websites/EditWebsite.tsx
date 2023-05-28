import {websiteCreationDTO, websiteDTO} from "./website.model";
import EditEntity from "../utils/EditEntity";
import {urlWebsite} from "../endpoints";
import {convertWebsiteToFormData} from "../utils/formDataUtils";
import WebsiteForm from "./WebsiteForm";

export default function EditWebsite() {

    function transform(website: websiteDTO): websiteCreationDTO{
        return {
            name: website.name,
            link: website.link,
            pictureURL: website.picture
        }
    }

    return(
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