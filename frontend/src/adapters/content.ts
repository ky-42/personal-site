import backend_axios from ".";
import * as ContentTypes from "../types/Content";
import { PageInfo, ContentPieceOptions, ContentAddParams } from "../types/RequestContent";



/* -------------------------- CRUD content adapters ------------------------- */

// Deals with an existing peice of content on the backend 
const GetContentPiece = async (params: ContentPieceOptions) => {
  console.log(params.slug)
  const response = await backend_axios({
    url: `/content/${params.slug}`,
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

// Gets a list of content from server
const GetContentList = async (params: PageInfo): Promise<Array<ContentTypes.FullContent>> => {
  const response = await backend_axios.get("/content/list", {
    params,
  })
  console.log(response);
  return ((response.status === 200) ? response.data : false);
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

/* -------------------------------------------------------------------------- */


/* ------------------------- Other Content Adapters ------------------------- */

// Gets Projects that are under development
const UnderDevProjects = async (): Promise<Array<ContentTypes.FullContent>> => {
  const response = await backend_axios.get("/content/list/projects/under-development")
  return ((response.status === 200) ? response.data : false);
}

// Gets the count of a type of content from backend
const CountContentType = async (contentType: ContentTypes.ContentType): Promise<number> => {
  const response = await backend_axios.get(`/content/count/${contentType}`);
  return ((response.status === 200) ? response.data.count : false);
}

/* -------------------------------------------------------------------------- */


export { GetContentPiece, GetContentList, ContentAdd, UnderDevProjects, CountContentType };
