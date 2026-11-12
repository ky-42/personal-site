import jsonConfig from "@config/config.json";
import {
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { NavigationType, useNavigationType } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { ContentOperations } from "../adapters/content";
import { jsonParser } from "../adapters/helpers";
import ContentListItem, {
  getColumnStart,
} from "../components/ContentShow/ContentListItem";
import LoadErrorHandle from "../components/RequestHandling/LoadingErrorHandler";
import { ShowLink } from "../components/Shared/Buttons";
import MetaData from "../components/Shared/MetaData";
import PageTitle from "../components/Shared/PageTitle";
import {
  NotificationContext,
  NotificationType,
} from "../contexts/Notification";
import useQuery from "../hooks/useQueryParams";
import { ContentType } from "../types/Content";
import { searchParamsToContentFilter } from "../types/HelperFuncs";
import {
  type ContentFilter,
  type FullContentList,
  type PageInfo,
  type RequestState,
  RequestStatus,
  listOrder as showOrder,
} from "../types/RequestContent";

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

const SearchBarWrapper = styled.div`
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
  ${(props) => (props.reload === null ? "" : loadAnimation)}
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
  display: grid;
  width: 100%;
  max-width: 88rem;
  grid-template-columns: repeat(4, 22rem);
  margin-bottom: 3rem;
  outline: 0.2rem solid ${(props) => props.theme.backgroundColour};
  outline-offset: -0.1rem;

  @media (max-width: 1000px) {
    max-width: 44rem;
    grid-template-columns: auto;
  }
`;

const EmptyText = styled.p`
  text-align: center;
  grid-column: 1 / -1;
`;

const ActiveLoadMore = css`
  color: ${(props) => props.theme.textColour};
  border: 0.3rem solid ${(props) => props.theme.lightTone};

  &:hover {
    border: 0.3rem solid ${(props) => props.theme.highlight};
  }
`;

const InactiveLoadMore = css`
  color: ${(props) => props.theme.lightTone};
  border: 0.3rem solid ${(props) => props.theme.darkTone};
`;

const LoadMore = styled.button<{ active: boolean }>`
  ${(props) => (props.active ? ActiveLoadMore : InactiveLoadMore)}
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
  // url is used to set the search bar and re-request with filters

  const notifications = useContext(NotificationContext);

  // Used to determine if user navigated backwards
  const navigationType = useNavigationType();

  // Gets query params from url
  const [searchParams, _, setSearchParams] = useQuery();
  const currentContentFilter = useMemo(
    () => searchParamsToContentFilter(ContentType.Blog, searchParams),
    [searchParams],
  );
  const currentOrdering = useMemo(
    () => (searchParams.get("ordering") as showOrder) || showOrder.Newest,
    [searchParams],
  );

  const [loadedQuery, setLoadedQuery] = useState([
    currentContentFilter,
    currentOrdering,
  ]);

  const restoreState =
    navigationType === NavigationType.Pop &&
    sessionStorage.getItem("blogListQuery") === searchParams.toString();

  // Info about pages of blogs
  // Uses sessionStorage to keep state when user navigates back
  const [page, setPage] = useState(
    sessionStorage.getItem("blogListPage") !== null &&
      navigationType === NavigationType.Pop &&
      restoreState
      ? JSON.parse(sessionStorage.getItem("blogListPage") as string)
      : 0,
  );
  const [maxPage, setMaxPage] = useState(1);

  // State for all the blogs the site has retrieved
  // Uses sessionStorage to keep state when user navigates back
  const [receivedBlogs, setReceivedBlogs] = useState<
    Record<number, FullContentList>
  >(
    sessionStorage.getItem("blogListReceivedBlogs") !== null &&
      navigationType === NavigationType.Pop &&
      restoreState
      ? JSON.parse(
          sessionStorage.getItem("blogListReceivedBlogs") as string,
          jsonParser,
        )
      : {},
  );

  // The latest set of blogs the site has retrieved
  // Need separate state for latest received for error handling reason
  // Uses sessionStorage to keep state when user navigates back
  const [latestReceivedBlogs, setLatestReceivedBlogs] = useState<
    RequestState<FullContentList>
  >(
    sessionStorage.getItem("blogListLatestReceivedBlogs") !== null &&
      navigationType === NavigationType.Pop &&
      restoreState
      ? JSON.parse(
          sessionStorage.getItem("blogListLatestReceivedBlogs") as string,
          jsonParser,
        )
      : { requestStatus: RequestStatus.Loading },
  );

  // State for when to re-request blogs
  const [reloadSearchAnimation, setReloadSearchAnimation] = useState<
    boolean | null
  >(null);

  // Used to store search timeout. If the timeout finished the search will
  // be run
  const [searchTimeout, setSearchTimeout] = useState<null | number>(null);

  // State for search bar
  const [currentSearch, setCurrentSearch] = useState<string>("");

  /* ----------------------------- Unmount effects ---------------------------- */

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      sessionStorage.setItem("blogListPage", page.toString());
      sessionStorage.setItem(
        "blogListReceivedBlogs",
        JSON.stringify(receivedBlogs),
      );
      sessionStorage.setItem(
        "blogListLatestReceivedBlogs",
        JSON.stringify(latestReceivedBlogs),
      );
      sessionStorage.setItem("blogListQuery", searchParams.toString());
    };
  });

  /* -------------------------- Next page requesting -------------------------- */

  // When the search bar changes, update the current state in the on page search bar
  useEffect(() => {
    setCurrentSearch(
      currentContentFilter.search ? currentContentFilter.search : "",
    );
  }, [currentContentFilter.search]);

  const clearPagesEvent = useEffectEvent(() => {
    clearPages();
  });

  const getCurrentPageEvent = useEffectEvent(
    (
      page: number,
      currentContentFilter: ContentFilter,
      currentOrdering: showOrder,
    ) => {
      getCurrentPage(page, currentContentFilter, currentOrdering);
    },
  );

  useEffect(() => {
    // Check if the query has changed, if it has clear the pages and request the first page
    if (
      loadedQuery[0] !== currentContentFilter ||
      loadedQuery[1] !== currentOrdering
    ) {
      clearPagesEvent();
      setLoadedQuery([currentContentFilter, currentOrdering]);
      return;
    }
    getCurrentPageEvent(page, currentContentFilter, currentOrdering);
  }, [page, currentContentFilter, currentOrdering, loadedQuery]);

  const loadMore = () => {
    // note that if last requested page was the last page the "load more" button wont work
    if (page < maxPage) {
      if (latestReceivedBlogs.requestStatus === RequestStatus.Success) {
        setReceivedBlogs((oldBlogs) => {
          oldBlogs[page] = latestReceivedBlogs.requestedData;
          return oldBlogs;
        });

        setPage(page + 1);
      } else {
        notifications.addNotification({
          type: NotificationType.Info,
          message: "Retrying...",
        });
        getCurrentPage(page, currentContentFilter, currentOrdering);
      }

      setLatestReceivedBlogs({ requestStatus: RequestStatus.Loading });
    }
  };

  /* ------------ Success and error effects and rendering elements ------------ */

  // How to render a list of blogs
  const RenderBlogList = ({ data }: { data: FullContentList }) => {
    return (
      <>
        {
          // Makes sure there are blogs to display
          data.page_count > 0 ? (
            data.full_content_list.map((gotBlog, index, fullList) => {
              return (
                <ContentListItem
                  content={gotBlog}
                  key={gotBlog.base_content.id}
                  startColumnTwo={getColumnStart(index, fullList.length, 2)}
                  startColumnThree={getColumnStart(index, fullList.length, 2)}
                />
              );
            })
          ) : (
            <EmptyText>No Blogs</EmptyText>
          )
        }
      </>
    );
  };

  // Side effect of request success should only run once
  const PageLoadSuccessEffect = ({ data }: { data: FullContentList }) => {
    setMaxPage(data.page_count - 1);
  };

  /* ---------------------------- Helper functions ---------------------------- */

  // Clears all the pages of blogs
  const clearPages = () => {
    setPage(0);
    setMaxPage(1);
    setReceivedBlogs({});
    setLatestReceivedBlogs({ requestStatus: RequestStatus.Loading });
  };

  const getCurrentPage = (
    page: number,
    currentContentFilter: ContentFilter,
    currentOrdering: showOrder,
  ) => {
    // Object passed to request for proper paging of projects
    const pageInfo: PageInfo = {
      content_per_page: contentPerPage,
      page,
      ordering: currentOrdering,
    };

    if (
      receivedBlogs[page] === undefined &&
      latestReceivedBlogs.requestStatus !== RequestStatus.Success
    ) {
      ContentOperations.get_content_list({
        page_info: pageInfo,
        content_filters: currentContentFilter,
      }).then((value) => {
        setLatestReceivedBlogs(value);
      });
    }
  };

  /* ------------------------- Filter change functions ------------------------ */

  // What happens when the show order of blogs changes
  const orderChange = (direction: showOrder) => {
    searchParams.set("ordering", direction);
    setSearchParams(searchParams);
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
        const newParams = new URLSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          search: search,
        });

        if (search === "") {
          newParams.delete("search");
        } else {
          newParams.set("search", search);
        }

        setSearchParams(newParams);
      }, 1250),
    );
  };

  /* -------------------------------------------------------------------------- */

  return (
    <BlogListBody>
      <MetaData
        title="Blogs | Kyle Denief"
        description={jsonConfig.pages.blogList.description}
        type="website"
      />

      <PageTitle>Blogs</PageTitle>

      <ShowOptions>
        <SearchBarWrapper>
          <SearchBar
            placeholder="Search"
            value={currentSearch}
            onChange={(e) => newSearch(e.target.value)}
          />
          <LoadBar
            // Key is used to reset the animation
            key={reloadSearchAnimation ? 1 : 0}
            reload={reloadSearchAnimation}
          />
        </SearchBarWrapper>
        <DropDown
          value={currentOrdering}
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
            <ShowLink button_text={"Clear Filters"} url={"/blogs"} />
          )
        }
      </ShowOptions>

      {/* Renders previous pages of successful blogs fetched */}
      <ContentList>
        {Array.from(Array(Object.keys(receivedBlogs).length).keys()).map(
          (value) => {
            return (
              <RenderBlogList
                data={receivedBlogs[value]}
                key={receivedBlogs[value].full_content_list[0].base_content.id}
              />
            );
          },
        )}
        {/* Renders lates blog page requested and handles errors if it fails */}
        <LoadErrorHandle
          requestInfo={latestReceivedBlogs}
          successElement={RenderBlogList}
          successEffect={{ effect: PageLoadSuccessEffect }}
        />
      </ContentList>

      <LoadMore active={page < maxPage} onClick={loadMore}>
        Load More
      </LoadMore>
    </BlogListBody>
  );
};

export default BlogList;
