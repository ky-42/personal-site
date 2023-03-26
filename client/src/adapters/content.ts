import axios from "axios";
import backend_axios from ".";
import { Blog, Devblog, FullContent, NewDevblog, Tag } from "../types/Content";
import { ContentAddParams, RequestState, RequestStatus, FullContentList, ContentSlug, ContentListInfo, ContentUpdateInfo, ContentPassword, BlogSlug, TagAddInfo, BlogSlugPassword, DevblogTitle, SurroundingData, SurroundingBlogs, DevblogAddInfo, DevblogUpdateInfo } from "../types/RequestContent";

/* ---------- General operation adapter for all backend operations ---------- */

interface OperationOptions {
  url: string,
  method: string,
  headers: Record<string, string>,
  password?: string,
  data?: Object,
  params?: Object
}

const GeneralOperation = async <FetchType>(params: OperationOptions): Promise<RequestState<FetchType>> => {
  try {
    const response = await backend_axios.request<FetchType>({
      url: params.url,
      method: params.method,
      data: params.data,
      headers: params.headers,
      params: params.params
    });

    return {requestStatus: RequestStatus.Success, requestedData: response.data};
  } catch (err) {
    return HandleAxiosError(err)
  }
}

/* -------------------------- CRUD content adapters ------------------------- */
  

export const ContentOperations = {
 "get_content": async (params: ContentSlug): Promise<RequestState<FullContent>> => {
    return await GeneralOperation<FullContent>({
      url: `/content/${params.slug}`,
      method: "GET",
      headers: {}
  })},

  "get_content_list": async (params: ContentListInfo): Promise<RequestState<FullContentList>> => {
    return await GeneralOperation<FullContentList>({
      url: `/content/list`,
      method: "GET",
      headers: {},
      params: {...params.page_info, ...params.content_filters}
  })},

  "add_content": async (params: ContentAddParams): Promise<RequestState<boolean>> => {
    let response = await GeneralOperation<boolean>({
      url: `/content/add`,
      method: "POST",
      headers: {
        "authorization": params.password,
        "Content-Type": "application/json"
      },
      data: JSON.stringify(params.addContent, (_, v) => v === undefined ? null : v)
    });
    if (response.requestStatus === RequestStatus.Success) response.requestedData = true;
    return response;
  },

  "update_content": async (params: ContentUpdateInfo): Promise<RequestState<boolean>> => {
    let response = await GeneralOperation<boolean>({
      url: `/content/${params.slug}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authorization": params.password
      },
      data: JSON.stringify(params.updated_content, (_, v) => v === undefined ? null : v)
    });
    if (response.requestStatus === RequestStatus.Success) response.requestedData = true;
    return response;
  },
  
  "delete_content": async (params: ContentPassword): Promise<RequestState<boolean>> => {
    let response = await GeneralOperation<boolean>({
      url: `/content/${params.slug}`,
      method: "DELETE",
      headers: {
        "authorization": params.password
      }
    });
    if (response.requestStatus === RequestStatus.Success) response.requestedData = true;
    return response;
  }
}

/* ------------------------- Tag operation adapters ------------------------- */

export const TagOperations = {
  "get_blog_tags": async (params: BlogSlug): Promise<RequestState<Tag[]>> => {
    return await GeneralOperation<Tag[]>({
      url: `/tag/${params.blog_slug}`,
      method: "GET",
      headers: {}
  })},

  "add_tags": async (params: TagAddInfo): Promise<RequestState<boolean>> => {
    let response = await GeneralOperation<boolean>({
      url: `/tag/${params.blog_slug}`,
      method: "POST",
      headers: {
        "authorization": params.password,
        "Content-Type": "application/json"
      },
      data: params.tags
    });
    if (response.requestStatus === RequestStatus.Success) response.requestedData = true;
    return response;
  },

  "delete_tags": async (params: BlogSlugPassword): Promise<RequestState<boolean>> => {
    let response = await GeneralOperation<boolean>({
      url: `/tag/${params.blog_slug}`,
      method: "DELETE",
      headers: {
        "authorization": params.password,
      }
    });
    if (response.requestStatus === RequestStatus.Success) response.requestedData = true;
    return response;
  }
}

/* ----------------------- Devblog Operation Adapters ----------------------- */

const DevblogOperations = {
  "get_devlog_object": async (params: DevblogTitle): Promise<RequestState<Devblog>> => {
    return await GeneralOperation<Devblog>({
      url: `/devblog/${params.title}`,
      method: "GET",
      headers: {}
  })},

  "get_surrounding_blogs": async (params: SurroundingData): Promise<RequestState<SurroundingBlogs>> => {
    return await GeneralOperation<SurroundingBlogs>({
      url: "/devblog/get-next-pre-blog",
      method: "GET",
      headers: {},
      params: params
    }); 
  }, 

  "add_devlog": async (params: DevblogAddInfo): Promise<RequestState<boolean>> => {
    let response = await GeneralOperation<boolean>({
      url: "/devblog/add",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": params.password
      },
      data: params.newDevblogInfo
    });
    if (response.requestStatus === RequestStatus.Success) response.requestedData = true;
    return response;
  },

  "update_devblog": async (params: DevblogUpdateInfo): Promise<RequestState<boolean>> => {
    let response = await GeneralOperation<boolean>({
      url: "/devblog/update",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authorization": params.password
      },
      data: params.updatedDevblogInfo
    });
    if (response.requestStatus === RequestStatus.Success) response.requestedData = true;
    return response;
  },

  "delete_devblog": async (params: DevblogTitle): Promise<RequestState<boolean>> => {
    let response = await GeneralOperation<boolean>({
      url: `/devblog/${params.title}`,
      method: "DELETE",
      headers: {}
    });
    if (response.requestStatus === RequestStatus.Success) response.requestedData = true;
    return response;
  }
}

/* -------------------------------------------------------------------------- */

const HandleAxiosError = (err: any): RequestState<any> => {
  if (axios.isAxiosError(err)) {
    if (err.response?.status && err.response?.statusText) {
      return {requestStatus: RequestStatus.Error, requestError: `${err.response?.status}: ${err.response?.statusText}`};
    } else {
      return {requestStatus: RequestStatus.Error, requestError: 'It worked on my machine... mostly'};
    }
  };
  return {requestStatus: RequestStatus.Error, requestError: "It worked on my machine..."};
};
