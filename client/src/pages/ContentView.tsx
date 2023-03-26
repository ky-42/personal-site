import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import { ContentOperations, TagOperations } from "../adapters/content";
import { FullContent, Tag } from "../types/Content";
import { RequestState, RequestStatus } from "../types/RequestContent";
import LoadErrorHandle from "../components/RequestHandling/LoadingErrorHandler";
import MetaData from "../components/Shared/MetaData";
import ContentBody from "../components/Shared/ContentBody";

/* -------------------------------------------------------------------------- */

const ContentViewBody = styled.main`
  margin: auto;
  max-width: 80.0rem;
`;

/* ----------------------- Page upper section elements ---------------------- */

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

/* ------------------------------ Project data ------------------------------ */

const OptionalProjectData = styled.div`
  display: flex;
`;

const LinkStyle = css`
  color: ${props => props.theme.textColour};
`;

const ExternalLink = styled.a`
`;

const InternalLink = styled(Link)`
  
`;

/* -------------------------------- Blog data ------------------------------- */

const TagDiv = styled.div`
  display: flex;
`;

const TagItem = styled(Link)`
  
`;

/* ----------------------- Page lower section elements ---------------------- */

const LowerSection = styled.div`
  line-height: 1.5;
`;

/* -------------------------------------------------------------------------- */

const ContentView = () => {
  
  const { slug } = useParams();
  
  const [pageContent, setPageContent] = useState<RequestState<FullContent>>({requestStatus: RequestStatus.Loading});
  
  const [isBlog, setIsBlog] = useState(false);
  const [blogTags, setBlogTags] = useState<RequestState<Tag[]>>({requestStatus: RequestStatus.Loading});
  const [previousSlug, setPreviousSlug] = useState<undefined | string>();
  const [nextSlug, setnextSlug] = useState<undefined | string>();
  
  // Needed to send users to 404 page when slug dosent exist
  const navigate = useNavigate();
  
  /* ------------ Get the content peice with the slug from the url ------------ */

  useEffect(() => {
    if (slug !== undefined ) {
      ContentOperations.get_content({
        slug,
      }).then((value: RequestState<FullContent>) => {
        setPageContent(value);
      });
    };
  }, [slug]);
  
  useEffect(() => {
    if (isBlog === true) {
    }
  }, [isBlog]);

  /* -------------------------------------------------------------------------- */
  
  const successEffect = ({data}: {data: FullContent}) => {
    if (data.base_content.content_type === "blog") {
      setIsBlog(true);

      TagOperations.get_blog_tags({blog_slug: data.base_content.slug}).then((value: RequestState<Tag[]>) => {
        setBlogTags(value);
      });
    };
  }

  // What is rendered when content is gotten successfully
  const RenderContent = ({data}: {data: FullContent}) => {

    // Formated dates for creation and editing
    const createDateString = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(data.base_content.created_at);
    const editDateString = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(data.base_content.updated_at);
    
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
          {`Created at: ${createDateString} ${editDateString !== undefined ? `| Edited At: ${editDateString}` : "" }`}
        </ContentDate>
        <ContentDesc>
          {data.base_content.content_desc}
        </ContentDesc>
      </TopSection>
      <LowerSection>
        <ContentBody>
          {data.base_content.body}
        </ContentBody>
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