import React, {useEffect, useState} from "react";
import styled, { css } from "styled-components";
import {CountContentType, GetContentList} from "../adapters/content";
import {ContentType, FullContent} from "../types/Content";
import {listOrder} from "../types/RequestContent";
import PageTitle from "../components/PageTitle";
import ContentListItem from "../components/ContentListItem";

const BlogListDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentList = styled.div`
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

const BlogList = () => {
  
  const content_per_page = 8;
  
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [receivedBlogs, setReceivedBlogs] = useState<FullContent[][]>([]);
  
  useEffect(() => {
    CountContentType(ContentType.Blog).then((blogCount) => {
      setMaxPage(Math.ceil(blogCount/content_per_page)-1);
    });
  }, [])

  useEffect(() => {
    GetContentList({
      content_per_page,
      page,
      show_order: listOrder.Newest,
      content_type: ContentType.Blog
    }).then((value) => {
        setReceivedBlogs(blogs => {
          if (typeof blogs[page] === 'undefined') {
            return [...blogs, value];
          } 
          return blogs;
        });
    });
  }, [page]);

  return (
    <BlogListDiv>
      <PageTitle>
        Blogs
      </PageTitle>
      <ContentList>
        {
          receivedBlogs.flat().map(gotBlog => {
            return <ContentListItem content={gotBlog} key={gotBlog.base_content.id} />;
          })
        }
      </ContentList>
      <LoadMore active={page !== maxPage} onClick={() => {if (page !== maxPage) setPage(page + 1)}}>
        Load More
      </LoadMore>
    </BlogListDiv>
  )
}

export default BlogList;