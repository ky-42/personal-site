import React, { useEffect, useState } from "react";
import { GetContentPiece } from "../adapters/content";
import { useParams } from "react-router-dom";
import { FullContent } from "../types/Content";
import styled from "styled-components";

const ContentViewDiv = styled.div`
  margin: auto;
  max-width: 800px;
`;

const TopSection = styled.div`
  
`;

const ContentTitle = styled.h1`
  margin-top: 28px;
  margin-bottom: 5px;
  font-size: clamp(1.3rem, 7vw, 3.75rem);
  text-decoration: underline ${props => props.theme.highlight} 2px;
  /* text-underline-offset: clamp(9px, 2.5vw, 15px); */
`;

const ContentDate = styled.p`
  color: ${props => props.theme.lightTone};
  margin: 0;
`;

const ContentDesc = styled.p`
  font-size: clamp(1.1rem, 5vw, 1.4rem);
  font-variation-settings: 'wght' 700;
`;

const ContentTypeDiv = styled.div`

`;

const LowerSection = styled.div`
  line-height: 1.5;
`;

const ContentBody = styled.p`
  font-size: clamp(1r05em, 4vw, 1.25rem);
`;

const ContentView = () => {
  
  const { slug } = useParams();
  
  const [pageContent, setPageContent] = useState<FullContent>();
  const [createDate, setCreateDate] = useState<String>();
  const [editDate, setEditDate] = useState<String>();
  
  useEffect(() => {
    if (slug !== undefined ) {
      GetContentPiece({
        slug,
        method: "GET",
      }).then((value: FullContent) => {
        const createDateString = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(value.base_content.created_at);
        const editDateString = new Intl.DateTimeFormat('en-US', {month: "short", day: "numeric", year: "numeric"}).format(value.base_content.updated_at);
        setCreateDate(createDateString);
        if (createDateString !== editDateString) {
          setEditDate(editDateString);
        };
        setPageContent(value);
      });
    };
  }, []);
  
  return (
    <ContentViewDiv>
      <TopSection>
        <ContentTitle>
          {pageContent?.base_content.title}
        </ContentTitle>
        <ContentDate>
          {`Created at: ${createDate} ${editDate !== undefined ? `| Edited At: ${editDate}` : "" }`}
        </ContentDate>
        <ContentDesc>
          {pageContent?.base_content.content_desc}
        </ContentDesc>
      </TopSection>
      <LowerSection>
        <ContentBody>
          {pageContent?.base_content.body}
        </ContentBody>
      </LowerSection>
    </ContentViewDiv>
  )
}

export default ContentView;