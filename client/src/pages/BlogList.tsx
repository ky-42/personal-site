import { useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { ContentOperations } from '../adapters/content';
import { ContentType } from '../types/Content';
import {
  FullContentList,
  listOrder as showOrder,
  PageInfo,
  RequestState,
  RequestStatus,
} from '../types/RequestContent';
import PageTitle from '../components/Shared/PageTitle';
import ContentListItem from '../components/ContentShow/ContentListItem';
import MetaData from '../components/Shared/MetaData';
import LoadErrorHandle from '../components/RequestHandling/LoadingErrorHandler';
import { ShowLink } from '../components/Shared/Buttons';
import jsonConfig from '@config/config.json';
import { searchParamsToContentFilter } from '../types/HelperFuncs';
import useQuery from '../hooks/useQueryParams';
import { NavigationType, useLocation, useNavigationType } from 'react-router-dom';
import { jsonParser } from '../adapters/helpers';

/* -------------------------------------------------------------------------- */

const BlogListBody = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ----------------------- Filter and search elements ----------------------- */

const ShowOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  row-gap: 2rem;
  max-width: 70rem;
  width: 100%;
  margin-bottom: clamp(2.5rem, 2.5vw, 5rem);
`;

const SearchBarWraper = styled.div`
  flex: 1 1 auto;
  position: relative;
  min-width: 10rem;
`;

const LoadBarKeyframes = keyframes`
  0% {width: 0%}
  100% {width: 100%}
`;

const loadAnimation = css`
  animation: ${LoadBarKeyframes} 1.25s linear 1;
`;

const LoadBar = styled.div<{ reload: boolean | null }>`
  position: relative;
  top: -0.2rem;
  width: 100%;
  height: 0.2rem;
  padding: 0 0.4rem;
  background-color: ${(props) => props.theme.highlight};
  z-index: 100;
  ${(props) => (props.reload === null ? '' : loadAnimation)}
`;

const SearchBar = styled.input`
  position: relative;
  width: 100%;
  font-size: 1.5rem;
  padding: 0.4rem;
  border: 0;
  color: ${(props) => props.theme.textColour};
  background-color: ${(props) => props.theme.backgroundColour};
  border-bottom: 0.2rem solid ${(props) => props.theme.lightTone};
  z-index: 200;

  &:placeholder {
    color: ${(props) => props.theme.lightTone};
  }

  &:focus {
    outline: 0;
    border: 0;
    border-bottom: 0.2rem solid ${(props) => props.theme.lightTone};
    color: ${(props) => props.theme.textColour};
    background-color: ${(props) => props.theme.darkTone};
    z-index: 0;
  }
`;

const DropDown = styled.select`
  flex: 0 0 auto;
  height: 3.2rem;
  background-color: ${(props) => props.theme.backgroundColour};
  font-size: 1.5rem;
  color: ${(props) => props.theme.textColour};
  border: 0;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    border: 0;
    outline: 0;
  }
`;

/* -------------------------- Content and show more ------------------------- */

const ContentList = styled.section`
  max-width: 88rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 3rem;
  outline: 0.2rem solid ${(props) => props.theme.backgroundColour};
  outline-offset: -0.1rem;
  @media (max-width: 1000px) {
    max-width: 44rem;
  }
`;

const ActiveLoadMore = css`
  color: ${(props) => props.theme.textColour};
  border: 0.3rem solid ${(props) => props.theme.lightTone};

  &:hover {
    border: 0.3rem solid ${(props) => props.theme.highlight};
  }
`;

const DeactiveLoadMore = css`
  color: ${(props) => props.theme.lightTone};
  border: 0.3rem solid ${(props) => props.theme.darkTone};
`;

const LoadMore = styled.button<{ active: boolean }>`
  ${(props) => (props.active ? ActiveLoadMore : DeactiveLoadMore)}
  display: block;
  padding: 1.2rem 4.5rem;
  font-size: 1.6rem;
  background-color: ${(props) => props.theme.backgroundColour};
`;

/* -------------------------------------------------------------------------- */

const BlogList = () => {
  const contentPerPage = jsonConfig.pages.blogList.contentPerPage;

  /* ---------------------------------- State --------------------------------- */

  // location.search used as dependency for useEffect as
  // url is used to set the search bar and rerequest with filters
  const location = useLocation();

  // Used to determine if user navigated backwards
  const naviagtionType = useNavigationType();

  // Gets query params from url
  const [searchParams, _, setSearchParams] = useQuery();
  const currentContentFilter = useMemo(
    () => searchParamsToContentFilter(ContentType.Blog, searchParams),
    [searchParams],
  );

  // Info about pages of blogs
  // Uses sessionStorage to keep state when user navigates back
  const [page, setPage] = useState(
    sessionStorage.getItem('blogListPage') !== null && naviagtionType === NavigationType.Pop
      ? JSON.parse(sessionStorage.getItem('blogListPage') as string)
      : 0,
  );
  const [maxPage, setMaxPage] = useState(1);

  // State for all the blogs the site has retreived
  // Uses sessionStorage to keep state when user navigates back
  const [recivedBlogs, setRecivedBlogs] = useState<Record<number, FullContentList>>(
    sessionStorage.getItem('blogListRecivedBlogs') !== null && naviagtionType === NavigationType.Pop
      ? JSON.parse(sessionStorage.getItem('blogListRecivedBlogs') as string, jsonParser)
      : {},
  );

  // The latest set of blogs the site has retreived
  // Need seperate state for latest recieved for error handling reason
  // Uses sessionStorage to keep state when user navigates back
  const [latestRecivedBlogs, setLatestRecivedBlogs] = useState<RequestState<FullContentList>>(
    sessionStorage.getItem('blogListLatestRecivedBlogs') !== null &&
      naviagtionType === NavigationType.Pop
      ? JSON.parse(sessionStorage.getItem('blogListLatestRecivedBlogs') as string, jsonParser)
      : { requestStatus: RequestStatus.Loading },
  );

  // State for when to rerequest blogs
  const [reloadSearchAnimation, setReloadSearchAnimation] = useState<boolean | null>(null);

  // Used to store search timeout. If the timeout finished the search will
  // be run
  const [searchTimeout, setSearchTimeout] = useState<null | number>(null);

  // State for search bar
  const [currentSearch, setCurrentSearch] = useState<string>('');

  /* ----------------------------- Unmount effects ---------------------------- */

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      sessionStorage.setItem('blogListPage', page.toString());
      sessionStorage.setItem('blogListRecivedBlogs', JSON.stringify(recivedBlogs));
      sessionStorage.setItem('blogListLatestRecivedBlogs', JSON.stringify(latestRecivedBlogs));
    };
  });

  /* -------------------------- Next page requesting -------------------------- */

  // Requests blogs and sets search bar
  useEffect(() => {
    // Checks if the url has changed and sets the current search to the
    // search query in the url. This is so that if the user changes the
    // url by manual input or the back button the search bar will update
    if (currentContentFilter.search !== currentSearch && currentContentFilter.search) {
      setCurrentSearch(currentContentFilter.search);
    } else if (!currentContentFilter.search && currentSearch !== '') {
      setCurrentSearch('');
    }

    // Object passed to request for proper paging of projects
    const pageInfo: PageInfo = {
      content_per_page: contentPerPage,
      page,
      show_order: (searchParams.get('show_order') as showOrder)
        ? (searchParams.get('show_order') as showOrder)
        : showOrder.Newest,
    };

    // Requests only new pages and the page check is need cause if
    // initial request fails the page gets set to negative one
    if (recivedBlogs[page] === undefined && page >= 0) {
      ContentOperations.get_content_list({
        page_info: pageInfo,
        content_filters: currentContentFilter,
      }).then((value) => {
        setLatestRecivedBlogs(value);
      });
    }
  }, [page, recivedBlogs, location.search]);

  // Requests more content
  const loadMore = () => {
    // TODO find way let user rerequest next page on error
    // note that if last requested page was the last page they loadmore button wont work
    if (page !== maxPage) {
      if (latestRecivedBlogs.requestStatus === RequestStatus.Success) {
        setRecivedBlogs((oldBlogs) => {
          oldBlogs[page] = latestRecivedBlogs.requestedData;
          return oldBlogs;
        });

        setPage(page + 1);
      } else {
        setPage(page + 1);
      }

      setLatestRecivedBlogs({ requestStatus: RequestStatus.Loading });
    }
  };

  /* ------------ Success and error effects and rendering elemetnts ----------- */

  // How to render a list of blogs
  const RenderBlogList = ({ data }: { data: FullContentList }) => {
    return (
      <>
        {
          // Makes sure there are blogs to display
          data.content_count > 0 ? (
            data.full_content_list.map((gotBlog) => {
              return <ContentListItem content={gotBlog} key={gotBlog.base_content.id} />;
            })
          ) : (
            <p>No Blogs</p>
          )
        }
      </>
    );
  };

  // Side effect of request error
  const PageLoadErrorEffect = (_errorString: { errorString: string }) => {
    setPage(page - 1);
  };

  // Side effect of request success should only run once
  const PageLoadSuccessEffect = ({ data }: { data: FullContentList }) => {
    const maxPageCalculation = Math.ceil(data.content_count / contentPerPage) - 1;
    setMaxPage(maxPageCalculation > 0 ? maxPageCalculation : 0);
  };

  /* ---------------------------- Helper functions ---------------------------- */

  // Gets a search param from the url
  // if it doesnt exist returns empty string
  const getSearchParam = (param: string): string => {
    const paramReturn = searchParams.get(param);
    if (paramReturn !== null) return paramReturn;
    return '';
  };

  // Clears all the pages of blogs
  const clearPages = () => {
    setPage(0);
    setMaxPage(1);
    setRecivedBlogs({});
    setLatestRecivedBlogs({ requestStatus: RequestStatus.Loading });
  };

  /* ------------------------- Filter change functions ------------------------ */

  // What happens when the show order of blogs changes
  const orderChange = (direction: showOrder) => {
    searchParams.set('show_order', direction);
    setSearchParams(searchParams);
    clearPages();
  };

  // Function for changing the search bar and the resulting effects
  const newSearch = (search: string) => {
    // If there is an existing time out it will clear it.
    // This is so that not everything typed will be searched
    if (searchTimeout !== null) {
      clearTimeout(searchTimeout);
    }

    setReloadSearchAnimation(!reloadSearchAnimation);
    setCurrentSearch(search);

    // Run the search in the search bar after 1.25 seconds
    setSearchTimeout(
      setTimeout(() => {
        clearPages();
        setSearchParams(
          new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), search: search }),
        );
      }, 1250),
    );
  };

  /* -------------------------------------------------------------------------- */

  return (
    <BlogListBody>
      <MetaData
        title='Blogs | Kyle Denief'
        description={jsonConfig.pages.blogList.description}
        type='website'
      />

      <PageTitle>Blogs</PageTitle>

      <ShowOptions>
        <SearchBarWraper>
          <SearchBar
            placeholder='Search'
            value={currentSearch}
            onChange={(e) => newSearch(e.target.value)}
          />
          <LoadBar
            // Key is used to reset the animation
            key={reloadSearchAnimation ? 1 : 0}
            reload={reloadSearchAnimation}
          />
        </SearchBarWraper>
        <DropDown
          value={getSearchParam('show_order') ? getSearchParam('show_order') : showOrder.Newest}
          onChange={(e) => orderChange(e.target.value as showOrder)}
        >
          <option value={showOrder.Newest}>Newest</option>
          <option value={showOrder.Oldest}>Oldest</option>
        </DropDown>
        {
          // Renders clear filters button if there are filters other then search
          ((Object.values(currentContentFilter).length > 1 &&
            currentContentFilter.search === undefined) ||
            Object.values(currentContentFilter).length > 2) && (
            <ShowLink button_text={'Clear Filters'} url={'/blogs'} />
          )
        }
      </ShowOptions>

      {/* Renders previous pages of successful blogs fetched */}
      <ContentList>
        <>
          {Array.from(Array(Object.keys(recivedBlogs).length).keys()).map((value) => {
            return (
              <RenderBlogList
                data={recivedBlogs[value]}
                key={recivedBlogs[value].full_content_list[0].base_content.id}
              />
            );
          })}
        </>

        {/* Renders lates blog page requested and handles errors if it fails */}
        <LoadErrorHandle
          requestInfo={latestRecivedBlogs}
          successElement={RenderBlogList}
          successEffect={{ effect: PageLoadSuccessEffect }}
          errorEffect={{ effect: PageLoadErrorEffect }}
        />
      </ContentList>

      <LoadMore active={page !== maxPage} onClick={loadMore}>
        Load More
      </LoadMore>
    </BlogListBody>
  );
};

export default BlogList;
