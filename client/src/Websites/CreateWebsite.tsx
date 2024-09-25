import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { websiteCreationDTO } from "./website.model";
import { convertWebsiteToFormData } from "../utils/formDataUtils";
import axios from "axios";
import { urlWebsite } from "../endpoints";
import DisplayErrors from "../utils/DisplayErrors";
import WebsiteForm from "./WebsiteForm";

export default function CreateWebsite() {
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  async function create(website: websiteCreationDTO) {
    try {
      const formData = convertWebsiteToFormData(website);

      await axios({
        method: "post",
        url: urlWebsite,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/websites");
    } catch (error) {
      // @ts-ignore
      if (error && error.response) {
        // @ts-ignore
        setErrors(error.response.data);
      }
    }
  }

  return (
    <>
      <h3>Create Website</h3>

      <DisplayErrors errors={errors} />

      <WebsiteForm
        model={{ name: "", link: "" }}
        onSubmit={async (values) => await create(values)}
      />
    </>
  );
}
