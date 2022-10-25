import { AxiosResponse } from "axios";
import { json } from "stream/consumers";
import backend_axios from ".";
import * as ContentTypes from "../types/Content";
import { PageInfo } from "../types/ViewContent";

interface ContentPieceOptions {
  slug: string,
  method: string,
  password?: string
  updated_content?: ContentTypes.FullContent
};

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

const GetContentPiece = async (params: ContentPieceOptions) => {
  console.log(params.slug)
  const response = await backend_axios({
    url: `/api/content/${params.slug}`,
    method: params.method,
    data: params.updated_content,
    headers: params.password ? {
      authorization: params.password
    } : undefined
  });
  console.log(response);
  // TODO throw promise error or something here
  return ((response.status === 200) ? response.data : false);
};

const GetContentList = async (params: PageInfo): Promise<Array<ContentTypes.FullContent>> => {
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

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

const UnderDevProjects = async (): Promise<Array<ContentTypes.FullContent>> => {
  const response = await backend_axios.get("/content/list/projects/under-development")
  return ((response.status === 200) ? response.data : false);
}

const CountContentType = async (contentType: ContentTypes.ContentType): Promise<number> => {
  const response = await backend_axios.get(`/content/count/${contentType}`);
  return ((response.status === 200) ? response.data.count : false);
}

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

export { GetContentPiece, GetContentList, ContentAdd, UnderDevProjects, CountContentType };
