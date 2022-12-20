import React from "react";
import styled from "styled-components";

import { FullContent } from "../../types/Content";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */

const ContentItemDiv = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  height: 140px;
  padding: 20px;
  color: ${props => props.theme.textColour};
  outline: 2px solid ${props => props.theme.darkTone};
  outline-offset: -1px;
  // In single column lets item grow vertically and centers it
  @media (max-width: 1000px){
    height: auto;
    min-height: 75px;
    justify-content: center;
  }
`
const ItemTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 0;
  // Keeps title from overflowing
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  // Increases max number of lines when there is one column
  @media (max-width: 1000px){
    -webkit-line-clamp: 4;
  }
`;

const ItemDate = styled.p`
  color: ${props => props.theme.lightTone};
  margin: 3px 0;
  font-size: clamp(0.6rem, 2.5vw, 0.75rem);
`;

const ItemDesc = styled.p`
  margin: 0;
  font-size: 1rem;
  // Keeps description from overflowing
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;

/* -------------------------------------------------------------------------- */

interface ContentItemProps {
  content: FullContent
}

const ContentListItem = ({content}: ContentItemProps) => {
  // Link to a peice of content that also displays info about it
  // For project list and blog list page

  // Creates readable date string for the date the content was created
  // so it can be shown
  const ContentDate = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(content.base_content.created_at)

  return (
    // Links to content is representing in form /content-type/slug
    <ContentItemDiv to={`/${content.base_content.content_type}s/${content.base_content.slug}`}>
      <ItemTitle>
        {content.base_content.title} 
      </ItemTitle>      
      <ItemDate>
        {ContentDate}
      </ItemDate>
      <ItemDesc>
        {content.base_content.content_desc}
      </ItemDesc>
    </ContentItemDiv>
  )
}

export default ContentListItem;