import React from "react";
import styled from "styled-components";
import { FullContent } from "../../types/Content";
import { Link } from "react-router-dom";

interface ContentItemProps {
  content: FullContent
}

const ContentItemDiv = styled(Link)`
  max-width: clamp(300px, 225px + 40vw, 500px);
  margin-left: clamp(10px, 5vw, 60px);
  color: ${props => props.theme.textColour};
`
const ItemTitle = styled.h4`
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  font-weight:normal;
  margin: 0;
`;

const ItemDate = styled.p`
  color: ${props => props.theme.lightTone};
  margin: 3px 0;
  font-size: clamp(0.6rem, 2.5vw, 0.75rem);
`;

const ItemDesc = styled.p`
  margin: 0;
  font-size: clamp(0.9rem, 3vw - 0.2rem, 1.05rem);
`;

const ContentItem = ({content}: ContentItemProps) => {
  const ContentDate = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(content.base_content.created_at)

  return (
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

export default ContentItem;
