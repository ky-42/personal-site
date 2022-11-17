import React from "react";
import styled from "styled-components";
import { FullContent } from "../../types/Content";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */

const ContentLink = styled(Link)`
  // Margin keeps content looking more centered becuase text is left aligned
  margin-left: clamp(10px, 5vw, 60px);
  max-width: 500px;
  color: ${props => props.theme.textColour};
`
const ContentTitle = styled.h4`
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  font-weight: normal;
  margin: 0;
`;

const ContentCreateDate = styled.p`
  color: ${props => props.theme.lightTone};
  margin: 3px 0;
  font-size: clamp(0.7rem, 1.875vw, 0.75rem);
`;

const ContentDesc = styled.p`
  margin: 0;
  font-size: clamp(0.9rem, 2.625vw, 1.05rem);
`;

/* -------------------------------------------------------------------------- */

interface ContentItemProps {
  content: FullContent
}

const ContentItem = ({content}: ContentItemProps) => {
  // A Link to a peice of content that also displays info about it

  // Creates readable date string for the date the content was created
  // so it can be shown
  const ContentDate = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(content.base_content.created_at)

  return (
    // Links to content is representing in form /content-type/slug
    <ContentLink to={`/${content.base_content.content_type}s/${content.base_content.slug}`}>
      <ContentTitle>
        {content.base_content.title} 
      </ContentTitle>      
      <ContentCreateDate>
        {ContentDate}
      </ContentCreateDate>
      <ContentDesc>
        {content.base_content.content_desc}
      </ContentDesc>
    </ContentLink>
  )
}

export default ContentItem;
