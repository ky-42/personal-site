import React from "react";
import styled from "styled-components";
import { ContentTypes } from "../adapters/ResponseTypes/content";

import PageTitle from "../components/PageTitle";

interface ContentListProps {
  content_type: ContentTypes
}

const ContentListDiv = styled.div`
  
`;

const ContentPreviewContainer = styled.div`
  
`;

const LoadMore = styled.button`
  margin: 0 auto;
  display: block; 
`;

const ContentList = ({content_type}:ContentListProps) => {
  
  return (
    <ContentListDiv>
      <PageTitle>
        {`${content_type}s`}
      </PageTitle>
      <ContentPreviewContainer>
        
      </ContentPreviewContainer>
      <LoadMore>
        Load More
      </LoadMore>
    </ContentListDiv>
  )
}

export default ContentList;