import { Blog, Content, NewContent, FullContent, NewBlog, NewFullContent, NewProject, Project, Devblog, NewDevblog } from "./Content";

// Converts a full content object to a new full content object
// Basically it will remove all data thats added by the backend
export const FullToNewFull = (conversionData: FullContent): NewFullContent => {
  let baseRemoved = contentToNew(conversionData.base_content);
  
  let unpackedExtra;
  if ("project" in conversionData.extra_content) {
    unpackedExtra = {"project": projectToNew(conversionData.extra_content.project)};
  } else {
    unpackedExtra = {"blog": blogToNew(conversionData.extra_content.blog)};
  }

  return {
    new_base_content: baseRemoved,
    new_extra_content: unpackedExtra
  };
}

// Converts Content type to NewContent
export const contentToNew = (contentData: Content): NewContent => {
  let { id: r1, created_at: r2, updated_at: r3, ...baseRemoved } = contentData;
  return baseRemoved;
}

// Coverts Blog type to NewBlog
export const blogToNew = (blogData: Blog): NewBlog => {
  let {id: r1, content_type: r2, ...extraRemoved} = blogData;
  return extraRemoved;
}

// Converts Project type to NewProject
export const projectToNew = (projectData: Project): NewProject => {
  let {id: r1, content_type: r2, ...extraRemoved} = projectData;
  return extraRemoved;
}

/* -------------------------------------------------------------------------- */
  
export const devblogToNew = (devblogData: Devblog): NewDevblog => {
  let {id: r1, ...extraRemoved} = devblogData;
  return extraRemoved;
}