import React, { Component, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import { ContentOperations, DevblogOperations, TagOperations } from "../adapters/content";
import { ContentType, FullContent, Tag } from "../types/Content";
import { RequestState, RequestStatus, SurroundingBlogs } from "../types/RequestContent";
import LoadErrorHandle from "../components/RequestHandling/LoadingErrorHandler";
import MetaData from "../components/Shared/MetaData";
import ContentBody from "../components/Shared/ContentBody";
import { Devblog } from "../types/Content";
import { DevblogLink, EmptyDevblogLink, ShowLink, ShowTag } from "../components/Shared/Buttons";
import { listOrder } from "../types/RequestContent";
import { FullContentList } from "../types/RequestContent";

/* -------------------------------------------------------------------------- */

const ContentViewBody = styled.main`
  margin: auto;
  max-width: 80.0rem;
`;

/* ------------------------ General Styled Components ----------------------- */

const Separator = styled.hr`
  stroke: ${props => props.theme.lightTone};
`;

/* ----------------------------- Header Elements ---------------------------- */

const TopSection = styled.header``;

const ContentTitle = styled.h1`
  margin-top: 2.8rem;
  margin-bottom: 0.5rem;
  font-size: clamp(2.72rem, 9vw, 6.0rem);

  @media (max-width: 400px){
    line-height: 160%;
  }
`;

const ContentDate = styled.p`
  color: ${props => props.theme.lightTone};
  margin: 0;
`;

const ContentDesc = styled.p`
  font-size: clamp(1.76rem, 5vw, 2.24rem);
  font-variation-settings: 'wght' 700;
`;

/* ----------------------- Page lower section elements ---------------------- */

const LowerSection = styled.div`
  line-height: 1.5;
`;

/* ----------------------------- Top Extra Data ----------------------------- */

const TopLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: clamp(1rem, 4vw, 2.5rem);
  row-gap: 1rem;
`;


/* -------------------------------- Blog data ------------------------------- */

const BlogBottomData = styled.div``;

const TagDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 1rem;
  column-gap: 1rem;
  margin: 2rem 0;
`;

const NextDevblogSection = styled.div`
  display: flex;
  justify-content: space-between;
  aligh-items: center;
  row-gap: 2rem;
  column-gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 850px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const DevblogTitleArea = styled(Link)`
  display: flex;
  flex-direction: column;
  aligh-items: center;
  justify-content: center;
  font-size: 2.4rem;
  color: ${props => props.theme.textColour};
  text-decoration: underline;
  text-align: center;
  width: 25rem;

  @media (max-width: 850px) {
    order: -1;
    flex-basis: 100%;
  }
`;

const DevblogTitleText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const DevblogTitle = styled.p`
  font-size: 1.75rem;
  margin: 0;
  margin-top: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* -------------------------------------------------------------------------- */

// Some code and state is dependant on the content type
// so comments for some parts are written assuming a type of content

const ContentView = () => {
  
  const { slug } = useParams();
  
  const [pageContent, setPageContent] = useState<RequestState<FullContent>>({requestStatus: RequestStatus.Loading});
  
  // The slug of the project that the blog is linked to
  const [linkedProjectSlug, setLinkedProjectSlug] = useState<string | undefined>(undefined);
  // The whether to show the linked blogs button depending on if blog there are linked blogs
  const [showLinkedBlogs, setShowLinkedBlogs] = useState<boolean>(false);
  
  const [blogTags, setBlogTags] = useState<RequestState<Set<Tag>>>({requestStatus: RequestStatus.Loading});
  const [devblog, setDevblog] = useState<RequestState<Devblog>>({requestStatus: RequestStatus.Loading});
  const [surroundingBlogs, setSurroundingBlogs] = useState<RequestState<SurroundingBlogs>>({requestStatus: RequestStatus.Loading});
  
  // Needed to send users to 404 page when slug dosent exist
  const navigate = useNavigate();
  
  /* --------------------- Gets content with slug from url -------------------- */

  useEffect(() => {
    if (slug !== undefined ) {
      ContentOperations.get_content({
        slug,
      }).then((value: RequestState<FullContent>) => {
        setPageContent(value);
      });
    };
  }, [slug]);
  
  /* -------------------------------------------------------------------------- */
  
  // If the content is successfully loaded then gets extra data
  // associated with the content
  const successEffect = ({data}: {data: FullContent}) => {

    if (data.base_content.content_type === "blog" && "blog" in data.extra_content) {
      // Gets tags for blog
      TagOperations.get_blog_tags({blog_slug: data.base_content.slug}).then((value: RequestState<Set<Tag>>) => {
        setBlogTags(value);
      });
      
      // Gets devblog and surrounding blogs if the blog is linked to a devblog
      if (data.extra_content.blog.devblog_id !== undefined) {
        DevblogOperations.get_devlog_object_from_id({
          id: data.extra_content.blog.devblog_id
        }).then((value: RequestState<Devblog>) => {
          setDevblog(value);      
        });
        
        DevblogOperations.get_surrounding_blogs({
          devblog_id: data.extra_content.blog.devblog_id,
          blog_slug: data.base_content.slug,
          direction_count: 1
        }).then((value: RequestState<SurroundingBlogs>) => {
          setSurroundingBlogs(value);
        });
      };
      
      // Gets the slug of the project that the blog is linked to
      if (data.extra_content.blog.related_project_id !== undefined) {
        ContentOperations.get_content_from_id({
          id: data.extra_content.blog.related_project_id
        }).then((value: RequestState<FullContent>) => {
          if (value.requestStatus === RequestStatus.Success) {
            setLinkedProjectSlug(value.requestedData.base_content.slug);
          };
        });
      };

    } else if (data.base_content.content_type === "project" && "project" in data.extra_content) {
      // Check if the project has any blogs
      ContentOperations.get_content_list({
        page_info: {
          content_per_page: 1,
          page: 0,
          show_order: listOrder.Newest
        },
        content_filters: {
          content_type: ContentType.Blog,
          project_blogs: data.base_content.id
        }
      }).then((value: RequestState<FullContentList>) => {
        if (value.requestStatus === RequestStatus.Success) {
          if (value.requestedData.content_count > 0) {
            setShowLinkedBlogs(true);
          };
        };
      });
    };
  };
  
  /* ------ Render components for extra data associated with the content ------ */

  const RenderBlogTags = ({data}: {data: Set<Tag>}) => {
    return (
        <TagDiv>
          {Array.from(data).map(tag => {
            return <ShowTag tagString={tag.title} key={tag.id} />
          })}
        </TagDiv>
    )
  }; 

  const RenderSurroundingBlogsButton = ({data, isPrevious}: {data: SurroundingBlogs, isPrevious: boolean}) => {
    let blogSlug;
    let blogTitle;

    // Checks if button to be rendered is for previous or next blog
    // then checks if there is a blog to be rendered if not a empty
    // button is rendered to keep the layout consistent
    if (isPrevious) {
      if (data.before_blogs.length !== 0) {
        blogSlug =  data.before_blogs[0].base_content.slug;
        blogTitle = data.before_blogs[0].base_content.title;
      } else {
        return <EmptyDevblogLink />
      }
    } else {
      if (data.after_blogs.length !== 0) {
        blogSlug =  data.after_blogs[0].base_content.slug;
        blogTitle = data.after_blogs[0].base_content.title;
      } else {
        return <EmptyDevblogLink />
      }
    }

    return (
      <DevblogLink button_text={blogTitle} url={`/blogs/${blogSlug}`} isPrevious={isPrevious} />
    )
  };
  
  const RenderDevblogName = ({data}: {data: Devblog}) => {
    return (
      <DevblogTitleArea to={``}>
        <DevblogTitleText>
          Part of Devblog:
        </DevblogTitleText>
        <DevblogTitle>
          {data.title}
        </ DevblogTitle>
      </DevblogTitleArea>
    )
  };
  
  /* ----------------- Render components for the base content ----------------- */
  
  // What is rendered when content is gotten successfully
  const RenderContent = ({data}: {data: FullContent}) => {

    // Formated dates for creation and editing
    const createDateString = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(data.base_content.created_at);
    const editDateString = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(data.base_content.updated_at);
    let projectStartString: undefined | string;   

    // Sections with data that depends on the content type
    let ExtraTopSection: JSX.Element = <></>;
    let ExtraBottomSection: JSX.Element = <></>;
    
    if (data.base_content.content_type === "project" && "project" in data.extra_content) {

      // Formated date for project start
      if (data.extra_content.project.start_date !== undefined) {
        projectStartString = new Intl.DateTimeFormat('en-US', {month: "short", year: "numeric"}).format(data.extra_content.project.start_date);
      }

      ExtraTopSection = (
        <TopLinks>
          {
            data.extra_content.project.github_link !== undefined &&
            <ShowLink button_text={"Github"} url={data.extra_content.project.github_link} />
          }
          {
            data.extra_content.project.url !== undefined &&
            <ShowLink button_text={"Visit Site"} url={data.extra_content.project.url} />
          }
          {
            // TODO: Could show error here using the RequestState
            showLinkedBlogs &&
            <ShowLink button_text={"Related Blogs"} url={""} />
          } 
        </TopLinks>
      );

    } else if (data.base_content.content_type === "blog" && "blog" in data.extra_content) {

      ExtraTopSection = (
        <TopLinks>
          {
            linkedProjectSlug !== undefined &&
            <ShowLink button_text={"Related Project"} url={`/projects/${linkedProjectSlug}`} />
          }
        </TopLinks>
      );
      
      ExtraBottomSection = (
        <BlogBottomData>
          {/* Renders tags */}
          <LoadErrorHandle 
            requestInfo={blogTags}
            successElement={RenderBlogTags}
          />
          {
            data.extra_content.blog.devblog_id !== undefined &&
            <>
              <Separator />
              <NextDevblogSection>
                {/* Render previous blog button */}
                <LoadErrorHandle
                  requestInfo={surroundingBlogs}
                  successElement={(data) => RenderSurroundingBlogsButton({data: data.data, isPrevious: true})}
                />
                {/* Renders devblog title */}
                <LoadErrorHandle
                  requestInfo={devblog}
                  successElement={RenderDevblogName}
                />
                {/* Renders next blog button */}
                <LoadErrorHandle
                  requestInfo={surroundingBlogs}
                  successElement={(data) => RenderSurroundingBlogsButton({data: data.data, isPrevious: false})}
                />
              </NextDevblogSection>
            </>
          }
        </BlogBottomData>
      );
    }
    
    return (
      <ContentViewBody>
        <MetaData 
          title={data.base_content.title}
          description={data.base_content.content_desc ? data.base_content.content_desc : "Error"}
          type="article"
        />
        <TopSection>
          <ContentTitle>
            {data.base_content.title}
          </ContentTitle>
          <ContentDate>
            {/* Renders the dates for posting, editing, and project start */}
            {`
              ${(projectStartString !== undefined ? `Project Started on: ${projectStartString} |` : "")}
              Posted On: ${createDateString}
              ${data.base_content.created_at === data.base_content.updated_at ? `| Edited On: ${editDateString}` : "" }
            `}
          </ContentDate>
          <ContentDesc>
            {data.base_content.content_desc}
          </ContentDesc>
          {
            ExtraTopSection
          }
        </TopSection>
        <LowerSection>
          <ContentBody>
            {data.base_content.body}
          </ContentBody>
          {
            ExtraBottomSection
          }
        </LowerSection>
      </ContentViewBody>
    )
  };
  
  const errorEffect = ({errorString}: {errorString: string}) => {
    if (errorString.startsWith("404")) {
      navigate("/404", {replace: true});
    };
  };

  /* -------------------------------------------------------------------------- */

  return (
    <LoadErrorHandle 
      requestInfo={pageContent}
      successElement={RenderContent}
      successEffect={{effect: successEffect}}
      errorEffect={{effect: errorEffect}}
    />
  )
}

export default ContentView;