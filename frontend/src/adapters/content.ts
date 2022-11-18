import axios from "axios";
import backend_axios from ".";
import { ContentType, FullContent } from "../types/Content";
import { PageInfo, ContentPieceOptions, ContentAddParams, RequestState, RequestStatus } from "../types/RequestContent";



/* -------------------------- CRUD content adapters ------------------------- */

// Deals with an existing peice of content on the backend 
const GetContentPiece = async <FetchType>(params: ContentPieceOptions): Promise<RequestState<FetchType>> => {
  try {

    const response = await backend_axios.request<FetchType>({
      url: `/content/${params.slug}`,
      method: params.method,
      data: params.updated_content,
      headers: params.password ? {
        authorization: params.password
      } : undefined
    });

    return {requestStatus: RequestStatus.Success, requestedData: response.data};

  } catch (err) {
    return HandleAxiosError(err);
  }
};

// Gets a list of content from server
const GetContentList = async (params: PageInfo): Promise<RequestState<FullContent[]>> => {
  try {

    const response = await backend_axios.get<FullContent[]>("/content/list", {
      params,
    });

    return {requestStatus: RequestStatus.Success, requestedData: response.data};

  } catch (err) {
    return HandleAxiosError(err);
  }
};

const ContentAdd = async ({ addContent, password }:ContentAddParams): Promise<RequestState<boolean>> => {
  try {

    const response = await backend_axios.post("/content/add", addContent, {
      headers: {
        authorization: password,
      }
    });
    
    return {requestStatus: RequestStatus.Success, requestedData: true};

  } catch (err) {
    return HandleAxiosError(err);
  }
};

/* -------------------------------------------------------------------------- */


/* ------------------------- Other Content Adapters ------------------------- */

// Gets Projects that are under development
const UnderDevProjects = async (): Promise<RequestState<FullContent[]>> => {
  try {

    const response = await backend_axios.get<FullContent[]>("/content/list/projects/under-development")
    return {requestStatus: RequestStatus.Success, requestedData: response.data};

  } catch (err) {
    return HandleAxiosError(err);
  }
}

// Gets the count of a type of content from backend
const CountContentType = async (contentType: ContentType): Promise<RequestState<number>> => {
  try {

    const response = await backend_axios.get<{count: number}>(`/content/count/${contentType}`);
    return {requestStatus: RequestStatus.Success, requestedData: response.data.count};

  } catch (err) {
    return HandleAxiosError(err);
  }
}

/* -------------------------------------------------------------------------- */

const HandleAxiosError = (err: any): RequestState<any> => {
  if (axios.isAxiosError(err)) {
    return {requestStatus: RequestStatus.Error, requestError: `${err.response?.status}: ${err.response?.statusText}`};
  };
  console.log(err);
  return {requestStatus: RequestStatus.Error, requestError: "It worked on my machine"};
}


export { GetContentPiece, GetContentList, ContentAdd, UnderDevProjects, CountContentType };
