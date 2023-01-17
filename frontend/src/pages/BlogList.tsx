import React, {useEffect, useState} from "react";
import styled, {css} from "styled-components";

import {GetContentList} from "../adapters/content";
import {ContentType} from "../types/Content";
import {FullContentList, listOrder, PageInfo, RequestState, RequestStatus} from "../types/RequestContent";
import PageTitle from "../components/PageTitle";
import ContentListItem from "../components/ContentShow/ContentListItem";
import MetaData from "../components/MetaData";
import LoadErrorHandle from "../components/RequestHandling/LoadingErrorHandler";

/* -------------------------------------------------------------------------- */

const BlogListBody = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* -------------------------------------------------------------------------- */

const ContentList = styled.section`
  max-width: 88.0rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 3.0rem;
  outline: 0.2rem solid ${props => props.theme.backgroundColour};
  outline-offset: -0.1rem;
  @media (max-width: 1000px){
    max-width: 44.0rem;
  }
`;

/* --------------------- Button to load more and its css -------------------- */

const ActiveLoadMore = css`
  color: ${props => props.theme.textColour};
  border: 0.3rem solid ${props => props.theme.lightTone};
  &:hover {
    border: 0.3rem solid ${props => props.theme.highlight};
  }
`;

const DeactiveLoadMore = css`
  color: ${props => props.theme.lightTone};
  border: 0.3rem solid ${props => props.theme.darkTone};
`;

const LoadMore = styled.button<{active: boolean}>`
  ${props => props.active ? ActiveLoadMore : DeactiveLoadMore}
  padding: 1.2rem 4.5rem;
  display: block; 
  background-color: ${props => props.theme.backgroundColour};
  font-size: 1.6rem;
`;

/* -------------------------------------------------------------------------- */

const BlogList = () => {
  
  const contentPerPage = 8;

  /* ---------------------------------- State --------------------------------- */
  
  // Info about pages of blogs
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  
  // State for all the blogs the site has retreived
  const [recivedBlogs, setRecivedBlogs] = useState<Record<number, FullContentList>>({});
  // The latest set of blogs the site has retreived
  // Need seperate state for latest recieved for error handling reason
  const [latestRecivedBlogs, setLatestRecivedBlogs] = useState<RequestState<FullContentList>>({requestStatus: RequestStatus.Loading});

  /* -------------------------- Next page requesting -------------------------- */

  // Requests next page of blogs
  useEffect(() => {

  // Object passed to request for proper paging of projects
    const pageInfo: PageInfo = {
      content_per_page: contentPerPage,
      page,
      show_order: listOrder.Newest  
    };

    // Requests only new pages and the page check is need cause if
    // initial request fails the page gets set to negative one
    if (recivedBlogs[page] === undefined && page >= 0) {
      GetContentList({
        page_info: pageInfo,
        content_filters: {
          content_type: ContentType.Blog
        }
      }).then(value => {
        setLatestRecivedBlogs(value);
      });
    }
  }, [page, recivedBlogs]);

  /* ----------- Elements to deal with errors using LoadErrorHandle ----------- */

  // How to render a list of blogs
  const RenderBlogList = ({data}: {data: FullContentList}) => {
    return (
      <>
        {
          data.full_content_list.map(gotBlog => {
            return <ContentListItem
              content={gotBlog}
              key={gotBlog.base_content.id}
            />
          ;})
        }
      </>
    )
  };

  // Side effect of request error
  const PageLoadErrorEffect = (errorString: {errorString: string}) => {
    setPage(page-1)
  }
  
  // Side effect of request success should only run once
  const PageLoadSuccessEffect = ({data}: {data: FullContentList}) => {
    setMaxPage(Math.ceil(data.content_count/contentPerPage)-1);
  }
  
  /* -------------------------------------------------------------------------- */

  // Requests more content 
  const loadMore = () => {
    // TODO find way let user rerequest next page on error
    // note that if last requested page was the last page they loadmore button wont work
    if (page !== maxPage) {
      if (latestRecivedBlogs.requestStatus === RequestStatus.Success) {
        setRecivedBlogs(oldBlogs => {
          oldBlogs[page] = latestRecivedBlogs.requestedData;
          return oldBlogs;
        });

        setPage(page + 1);
      } else {
        setPage(page + 1);
      }

      setLatestRecivedBlogs({requestStatus: RequestStatus.Loading});
    }
  };

  /* -------------------------------------------------------------------------- */

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

      <ContentList>
        <>
          {
            Array.from(Array(Object.keys(recivedBlogs).length).keys()).map((value) => {
              return <RenderBlogList
                data={recivedBlogs[value]}
                key={recivedBlogs[value].full_content_list[0].base_content.id}
              />
            })
          }
        </>

        {/* If more filtering is added might need to chage call count in successEffect */}
        <LoadErrorHandle
          requestInfo={latestRecivedBlogs}
          successElement={RenderBlogList}
          successEffect={{effect: PageLoadSuccessEffect, callCount: 1}}
          errorEffect={{effect: PageLoadErrorEffect}}
        />
      </ContentList>

      <LoadMore active={page !== maxPage} onClick={loadMore}>
        Load More
      </LoadMore>

    </BlogListBody>
  )
}

export default BlogList;