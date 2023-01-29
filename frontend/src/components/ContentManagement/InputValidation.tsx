import { NewContent, NewBlog, NewProject, Content } from "../../types/Content";

type abc =
    {type: "content", data: NewContent} |
    {type: "blog", data: NewBlog} |
    {type: "project", data: NewProject};


export const validate = <T extends abc,>({type, data}: T): typeof data | Record<string, string> => {
    let validationErrors: Record<string, string> = {};

    switch (type) {
        case "content":
            validateContent(data, validationErrors);
            break
        case "blog":
            validateBlog(data, validationErrors);
            break
        case "project":
            validateProject(data, validationErrors);
            break
    }
    
    if (validationErrors.length) {
        return validationErrors;
    }
    
    return data;
}
const validateContent = (data: NewContent, validationErrors: Record<string, string>) => {
    let key: keyof NewContent;
    for (key in data) {
        if (!emptyToUndefined(data[key])) {
            if (
                key === "content_desc"
            ) {
                data[key] = undefined;
            } else {
                validationErrors[key] = "Value needed";
            }
        }
    }
}

const validateBlog = (data: NewBlog, validationErrors: Record<string, string>) => {
    let key: keyof NewBlog;
    for (key in data) {
        if (!emptyToUndefined(data[key])) {
            if (
                key === "tags"
            ) {
                data[key] = undefined;
            } else {
                validationErrors[key] = "Value needed";                
            }
        }
    }
}

const validateProject = (data: NewProject, validationErrors: Record<string, string>) => {
    let key: keyof NewProject;
    for (key in data) {
        if (!emptyToUndefined(data[key])) {
            if (
                false
            ) {
                // data[key] = undefined;
            } else {
                validationErrors[key] = "Value needed";                
            }
        }
    }
}

const emptyToUndefined = (value: any): true | undefined => {
    if (value === undefined) {
        return undefined;
    } else if (
        (Array.isArray(value) || typeof value === "string")
        && value.length === 0
    ) {
        return undefined;
    } else if (
        typeof value === "object"
        && Object.keys(value).length === 0 
    ) {
        return undefined;
    }
    return true;
}

