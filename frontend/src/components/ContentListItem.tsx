import React from "react";
import styled from "styled-components";
import { FullContent } from "../types/Content";
import { Link } from "react-router-dom";

interface ContentItemProps {
  content: FullContent
}

const ContentItemDiv = styled(Link)`
  flex: 0 0 1;
  width: 100%;
  max-width: 400px;
  height: 140px;
  outline: 2px solid ${props => props.theme.darkTone};
  color: ${props => props.theme.textColour};
  outline-offset: -1px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  @media (max-width: 1000px){
    height: auto;
    min-height: 75px;
    justify-content: center;
  }
`
const ItemTitle = styled.h4`
  flex: 0 0 1;
  font-size: 1.25rem;
  font-weight:normal;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  @media (max-width: 1000px){
    -webkit-line-clamp: 4;
  }
`;

const ItemDate = styled.p`
  flex: 0 0 1;
  color: ${props => props.theme.lightTone};
  margin: 3px 0;
  font-size: clamp(0.6rem, 2.5vw, 0.75rem);
`;

const ItemDesc = styled.p`
  margin: 0;
  font-size: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;

const ContentListItem = ({content}: ContentItemProps) => {
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

export default ContentListItem;