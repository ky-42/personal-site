import axios from "axios";
import backend_axios from ".";
import { ContentType, FullContent } from "../types/Content";
import { PageInfo, ContentPieceOptions, ContentAddParams, RequestState, RequestStatus, FullContentList, ContentFilter } from "../types/RequestContent";



/* -------------------------- CRUD content adapters ------------------------- */

// Deals with an existing peice of content on the backend 
const ContentPieceOperations = async <FetchType>(params: ContentPieceOptions): Promise<RequestState<FetchType>> => {
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

interface ContentListInfo {
  page_info: PageInfo,
  content_filters: ContentFilter
}

const GetContentList = async ({page_info, content_filters}: ContentListInfo): Promise<RequestState<FullContentList>> => {
  try {

    const response = await backend_axios.get<FullContentList>("/content/list", {
      params: {...page_info, ...content_filters}
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

const HandleAxiosError = (err: any): RequestState<any> => {
  if (axios.isAxiosError(err)) {
    return {requestStatus: RequestStatus.Error, requestError: `${err.response?.status}: ${err.response?.statusText}`};
  };
  return {requestStatus: RequestStatus.Error, requestError: "It worked on my machine"};
};


export { ContentPieceOperations, GetContentList, ContentAdd };
