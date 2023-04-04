import { NewContent, NewBlog, NewProject, NewDevblog } from "../../types/Content";


// Ensures that data in a content object is valid
export const validateContent = (data: NewContent, validationErrors: Record<string, string>) => {
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

// Ensures that data in a blog object is valid
export const validateBlog = (data: NewBlog, validationErrors: Record<string, string>) => {
    let key: keyof NewBlog;
    for (key in data) {
        if (!emptyToUndefined(data[key])) {
            data[key] = undefined;
        }
    }
}

// Ensures that data in a project object is valid
export const validateProject = (data: NewProject, validationErrors: Record<string, string>) => {
    let key: keyof NewProject;
    for (key in data) {
        if (!emptyToUndefined(data[key])) {
            if (
                key === "url" || 
                key === "github_link" ||
                key === "start_date" 
            ) {
                data[key] = undefined;
            } else {
                validationErrors[key] = "Value needed";                
            }
        }
    }
}

// Ensures that data in a devblog object is valid 
export const validateDevblog = (data: NewDevblog, validationErrors: Record<string, string>) => {
    let key: keyof NewDevblog;
    for (key in data) {
        if (!emptyToUndefined(data[key])) {
            if (
                key === "title"
            ) {
                validationErrors[key] = "Value needed";                
            } 
        }
    }
}

// Converts empty values to undefined
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

