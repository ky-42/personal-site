import React, {useEffect, useState} from "react";
import styled, { css } from "styled-components";
import {CountContentType, GetContentList} from "../adapters/content";
import {ContentType, FullContent} from "../types/Content";
import {listOrder, RequestState, RequestStatus} from "../types/RequestContent";
import PageTitle from "../components/PageTitle";
import ContentListItem from "../components/ContentListItem";
import MetaData from "../components/MetaData";
import LoadErrorHandle from "../components/LoadingErrorHandler";

/* -------------------------------------------------------------------------- */

const BlogListBody = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* -------------------------------------------------------------------------- */

const ContentList = styled.section`
  max-width: 880px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  outline: 2px solid ${props => props.theme.backgroundColour};
  outline-offset: -1px;
  @media (max-width: 1000px){
    max-width: 440px;
  }
`;

/* -------------------------------------------------------------------------- */

const ActiveLoadMore = css`
  color: ${props => props.theme.textColour};
  border: 3px solid ${props => props.theme.lightTone};
  &:hover {
    border: 3px solid ${props => props.theme.highlight};
  }
`;

const DeactiveLoadMore = css`
  color: ${props => props.theme.lightTone};
  border: 3px solid ${props => props.theme.darkTone};
`;

const LoadMore = styled.button<{active: boolean}>`
  ${props => props.active ? ActiveLoadMore : DeactiveLoadMore}
  margin: 30px;
  padding: 12px 45px;
  display: block; 
  background-color: ${props => props.theme.backgroundColour};
  font-size: 1rem;
`;

/* -------------------------------------------------------------------------- */

const BlogList = () => {
  
  const content_per_page = 8;
  
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  
  const [recivedBlogs, setRecivedBlogs] = useState<FullContent[]>([]);
  
  // Gets max page
  useEffect(() => {
    CountContentType(ContentType.Blog).then((blogCount) => {
      // Error handling for max page count
      switch (blogCount.requestStatus){
        case RequestStatus.Error:
          // TODO make notification to user that this happend
          setMaxPage(1000);
          break;
        case RequestStatus.Success:
          setMaxPage((Math.ceil(blogCount.requestedData/content_per_page)-1));
          break;
      }
    });
  }, [])
  
  useEffect(() => {
    GetContentList({
      content_per_page,
      page,
      show_order: listOrder.Newest,
      content_type: ContentType.Blog
    }).then(value => {
      switch (value.requestStatus){
        case RequestStatus.Error:
          // TODO make notification to user that this happend
          break;
        case RequestStatus.Success:
          setRecivedBlogs(alreadyRecivedBlogs => {return alreadyRecivedBlogs.concat(value.requestedData)});
          break;
      }
    });
  }, [page]);

  const listFetchSuccess = (data: FullContent[]) => {
    return (
      <ContentList>
        {
          recivedBlogs.map(gotBlog => {
            return <ContentListItem content={gotBlog} key={gotBlog.base_content.id} />;
          })
        }
      </ContentList>
    )
  }

  return (
    <BlogListBody>

      <MetaData
        title="Blogs | Kyle Denief"
        description="A list of the blogs I've created. Most are about my experiences programming but theres a little bit of everything!"
        type="website"
      />

      <PageTitle>
        Blogs
      </PageTitle>

      <LoadErrorHandle requestInfo={pageFinishedProjects} successCallback={listFetchSuccess} />

      <LoadMore active={page !== maxPage} onClick={() => {if (page !== maxPage) setPage(page + 1)}}>
        Load More
      </LoadMore>

    </BlogListBody>
  )
}

export default BlogList;