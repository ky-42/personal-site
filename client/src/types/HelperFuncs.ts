import {
  Blog,
  Content,
  NewContent,
  FullContent,
  NewBlog,
  NewFullContent,
  NewProject,
  Project,
  Devblog,
  NewDevblog,
  ContentType,
} from './Content';
import { ContentFilter } from './RequestContent';

// Converts a full content object to a new full content object
// Basically it will remove all data thats added by the backend
export const FullToNewFull = (conversionData: FullContent): NewFullContent => {
  const baseRemoved = contentToNew(conversionData.base_content);

  let unpackedExtra;
  if ('project' in conversionData.extra_content) {
    unpackedExtra = { project: projectToNew(conversionData.extra_content.project) };
  } else {
    unpackedExtra = { blog: blogToNew(conversionData.extra_content.blog) };
  }

  return {
    new_base_content: baseRemoved,
    new_extra_content: unpackedExtra,
  };
};

// Converts Content type to NewContent
export const contentToNew = (contentData: Content): NewContent => {
  const { id: _r1, created_at: _r2, updated_at: _r3, ...baseRemoved } = contentData;
  return baseRemoved;
};

// Coverts Blog type to NewBlog
export const blogToNew = (blogData: Blog): NewBlog => {
  const { id: _r1, content_type: _r2, ...extraRemoved } = blogData;
  return extraRemoved;
};

// Converts Project type to NewProject
export const projectToNew = (projectData: Project): NewProject => {
  const { id: _r1, content_type: _r2, ...extraRemoved } = projectData;
  return extraRemoved;
};

/* -------------------------------------------------------------------------- */

export const devblogToNew = (devblogData: Devblog): NewDevblog => {
  const { id: _r1, ...extraRemoved } = devblogData;
  return extraRemoved;
};

/* -------------------------------------------------------------------------- */

// Converts url search params to a content filter
export const searchParamsToContentFilter = (
  content_type: ContentType,
  searchParams: URLSearchParams,
): ContentFilter => {
  const contentFilter: ContentFilter = { content_type };

  if (searchParams.has('project_status')) {
    contentFilter.project_status = searchParams.get(
      'project_status',
    ) as ContentFilter['project_status'];
  }
  if (searchParams.has('project_id')) {
    contentFilter.project_id = parseInt(searchParams.get('project_id') as string);
  }
  if (searchParams.has('blog_tag')) {
    contentFilter.blog_tag = searchParams.get('blog_tag') as ContentFilter['blog_tag'];
  }
  if (searchParams.has('devblog_id')) {
    contentFilter.devblog_id = parseInt(searchParams.get('devblog_id') as string);
  }
  if (searchParams.has('search')) {
    contentFilter.search = searchParams.get('search') as ContentFilter['search'];
  }

  return contentFilter;
};
