import { AxiosResponse } from "axios";
import { json } from "stream/consumers";
import backend_axios from ".";
import * as ContentTypes from "./ResponseTypes/content";

interface ContentPeiceOptions {
  slug: string,
  method: string,
  updated_content?: ContentTypes.FullContent
};

const ContentPeice = async (params:ContentPeiceOptions) => {
  const response = await backend_axios({
    url: `/content/${params.slug}`,
    method: params.method,
    data: params.updated_content,
  });
  console.log(response);
  return ((response.status === 200) ? response.data : false);
};

const ContentList = async (params:ContentTypes.PageInfo): Promise<Array<ContentTypes.FullContent>> => {
  const response = await backend_axios.get("/content/list", {
    params,
  })
  console.log(response);
  return ((response.status === 200) ? response.data : false);
};

interface ContentAddParams {
  addContent: ContentTypes.NewFullContent,
  password: string
};

const ContentAdd = async ({ addContent, password }:ContentAddParams): Promise<boolean> => {
  const response = await backend_axios.post("/content/add", addContent, {
    headers: {
      authorization: password,
    }
  });
  console.log(response);
  return (response.status === 200);
};

export { ContentPeice, ContentList, ContentAdd };