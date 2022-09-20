import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GetContentList } from "../adapters/content";
import { ContentTypes, PageInfo, listOrder, FullContent } from "../types/Content";

import PageTitle from "../components/PageTitle";
import ContentItem from "../components/ContentItem"

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
  
  const [page, setPage] = useState(0);
  const [recivedContent, setRecivedContent] = useState<FullContent[]>([]);
  
  useEffect(() => {
    GetContentList({
      content_per_page: 6,
      page,
      show_order: listOrder.Newest,
      content_type
    }).then((value) => setRecivedContent(state => [...state, ...recivedContent]))
  }, [page])

  return (
    <ContentListDiv>
      <PageTitle>
        {`${content_type}s`}
      </PageTitle>
      <ContentPreviewContainer>
        {
          recivedContent.map(gotContent => {
            return <ContentItem content={gotContent} />;
          })
        }
      </ContentPreviewContainer>
      <LoadMore onClick={() => setPage(page + 1)}>
        Load More
      </LoadMore>
    </ContentListDiv>
  )
}

export default ContentList;