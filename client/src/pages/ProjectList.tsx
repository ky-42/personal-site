import { useContext, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { AiFillCaretLeft } from 'react-icons/ai';
import { ContentOperations } from '../adapters/content';
import { FullContentList, listOrder, RequestState, RequestStatus } from '../types/RequestContent';
import { ContentType, ProjectStatus } from '../types/Content';
import PageTitle from '../components/Shared/PageTitle';
import ContentListItem, { getColumnStart } from '../components/ContentShow/ContentListItem';
import LoadErrorHandle from '../components/RequestHandling/LoadingErrorHandler';
import MetaData from '../components/Shared/MetaData';
import { NavigationType, useNavigationType } from 'react-router-dom';
import { jsonParser } from '../adapters/helpers';
import jsonConfig from '@config/config.json';
import { NotificationContext, NotificationType } from '../contexts/Notification';

/* -------------------------------------------------------------------------- */

const ProjectListBody = styled.main``;

/* ------------------------ Elements to show projects ----------------------- */

const AllProjectsDiv = styled.div``;

const ProjectsTypeDiv = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentList = styled.div`
  display: grid;
  width: 100%;
  max-width: 132rem;
  grid-template-columns: repeat(6, 22rem);
  // Outline covers the outline of the outside of the inside
  // elements border for effect
  outline: 0.2rem solid ${(props) => props.theme.backgroundColour};
  outline-offset: -0.1rem;

  // Changes number of columns based on screen width
  @media (max-width: 1500px) {
    grid-template-columns: repeat(4, 22rem);
    max-width: 88rem;
  }

  @media (max-width: 1000px) {
    max-width: 44rem;
    grid-template-columns: auto;
  }
`;

const ProjectsTypeTitle = styled.h2`
  font-size: clamp(2.72rem, 6vw, 3.2rem);
`;

/* ------------------- Elements for arrows to change pages ------------------ */

const PageChangeDiv = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Horizontal flip effect for arrow
const FlipCss = css`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`;

/* -------- Types of arrows that depend on if you can go to next page ------- */
const ActiveArrow = css`
  cursor: pointer;
  color: ${(props) => props.theme.lightTone};
  &:hover {
    color: ${(props) => props.theme.highlight};
  }
`;

const DeactiveArrow = css`
  color: ${(props) => props.theme.darkTone};
`;
/* -------------------------------------------------------------------------- */

const Arrow = styled(AiFillCaretLeft)<{ active: number; flip?: number }>`
  font-size: 3.6rem;
  ${(props) => (props.active ? ActiveArrow : DeactiveArrow)}
  ${(props) => (props.flip ? FlipCss : '')}
`;

const PageNum = styled.p`
  margin: 0rem 2rem;
  font-size: 2.88rem;
`;

/* -------------------------------------------------------------------------- */

const ProjectList = () => {
  const contentPerPage = 6;

  // Used to determine if user navigated backwards
  const navigationType = useNavigationType();

  const notifications = useContext(NotificationContext);

  // Uses sessionStorage to keep state when user navigates back
  const [page, setPage] = useState(
    sessionStorage.getItem('projectListPage') && navigationType === NavigationType.Pop
      ? parseInt(sessionStorage.getItem('projectListPage') ?? '0')
      : 0,
  );
  const [maxPage, setMaxPage] = useState(0);

  // Uses sessionStorage to keep state when user navigates back
  const [underDevProjects, setUnderDevProjects] = useState<RequestState<FullContentList>>(
    sessionStorage.getItem('projectListUnderDev') && navigationType === NavigationType.Pop
      ? JSON.parse(sessionStorage.getItem('projectListUnderDev') as string, jsonParser)
      : { requestStatus: RequestStatus.Loading },
  );
  // Needed cause no depedencies for under dev useEffect and
  // no clear thing to add there so this will reload the page
  // for under dev
  const [underDevReload, setUnderDevReload] = useState(false);

  // Uses sessionStorage to keep state when user navigates back
  const [pageFinishedProjects, setPageFinishedProjects] = useState<RequestState<FullContentList>>(
    sessionStorage.getItem('projectListFinishedPage') && navigationType === NavigationType.Pop
      ? JSON.parse(sessionStorage.getItem('projectListFinishedPage') as string, jsonParser)
      : { requestStatus: RequestStatus.Loading },
  );
  const [fetchedFinishedProjects, setFetchedFinishedProjects] = useState<
    Record<number, RequestState<FullContentList>>
  >(
    sessionStorage.getItem('projectListFinishedList') && navigationType === NavigationType.Pop
      ? JSON.parse(sessionStorage.getItem('projectListFinishedList') as string, jsonParser)
      : {},
  );

  // Used to scroll to top of list of projects when page changes and top
  // is out of view
  const finishedHeader = useRef<HTMLHeadingElement>(null);

  // Makes sure page dosent go negative or past the max page
  const changePageNum = (change: boolean) => {
    if ((page > 0 && !change) || (maxPage > page && change)) {
      change ? setPage(page + 1) : setPage(page - 1);
    }
  };

  /* ----------------------------- Unmount effects ---------------------------- */

  useEffect(() => {
    return () => {
      sessionStorage.setItem('projectListPage', page.toString());
      sessionStorage.setItem('projectListFinishedPage', JSON.stringify(pageFinishedProjects));
      sessionStorage.setItem('projectListUnderDev', JSON.stringify(underDevProjects));
      sessionStorage.setItem('projectListFinishedList', JSON.stringify(fetchedFinishedProjects));
    };
  });

  /* ------------------- useEffect functions to reuqest data ------------------ */

  // Gets under dev projects if not already fetched
  useEffect(() => {
    if (underDevProjects.requestStatus !== RequestStatus.Success) {
      ContentOperations.get_content_list({
        page_info: {
          content_per_page: 12,
          page: 0,
          show_order: listOrder.ProjectStartNewest,
        },
        content_filters: {
          content_type: ContentType.Project,
          project_status: ProjectStatus.UnderDevelopment,
        },
      }).then((value) => {
        setUnderDevProjects(value);
      });
    }
  }, [underDevReload]);

  // Gets the current pages finished projects
  useEffect(() => {
    // Checks if the page the user is on was already fetched
    if (fetchedFinishedProjects[page] === undefined) {
      ContentOperations.get_content_list({
        page_info: {
          content_per_page: contentPerPage,
          page,
          show_order: listOrder.ProjectStartNewest,
        },
        content_filters: {
          content_type: ContentType.Project,
          project_status: ProjectStatus.Finished,
        },
      }).then((value) => {
        // Sets fetched content to the value to show on the current page
        setPageFinishedProjects(value);
        // Saves content incase user returns to this page
        setFetchedFinishedProjects((projectsListRecord) => {
          projectsListRecord[page] = value;
          return projectsListRecord;
        });
      });
    } else {
      // Uses old data if page was requested before
      setPageFinishedProjects(fetchedFinishedProjects[page]);
    }
  }, [page, fetchedFinishedProjects]);

  /* ------------------------ Request succses functions ----------------------- */

  // Side effect of request success should only run once and for finished projects
  const PageLoadSuccessEffect = ({ data }: { data: FullContentList }) => {
    setMaxPage(data.page_count - 1);
  };

  // What element to show when fetch requests for projects lists succeed
  const FinishedFetchSuccess = ({ data }: { data: FullContentList }) => {
    return (
      <ContentList>
        {
          // Makes sure there are projects to display
          data.page_count > 0 ? (
            data.full_content_list.map((gotProjects, index, fullList) => {
              return (
                <ContentListItem
                  content={gotProjects}
                  key={gotProjects.base_content.id}
                  startColumnTwo={getColumnStart(index, fullList.length, 2)}
                  startColumnThree={getColumnStart(index, fullList.length, 3)}
                />
              );
            })
          ) : (
            <p>No Projects</p>
          )
        }
      </ContentList>
    );
  };

  /* ------------------------- Request error functions ------------------------ */
  // Function reload current page of projects for there respective sections

  const FinishedPageRetry = () => {
    notifications.addNotification({
      type: NotificationType.Info,
      message: 'Rerequesting finished page',
    });

    setPageFinishedProjects({ requestStatus: RequestStatus.Loading });

    // Works cause this is watched by useEffect
    setFetchedFinishedProjects((state) => {
      delete state[page];
      return { ...state };
    });
  };

  const UnderDevRetry = () => {
    notifications.addNotification({
      type: NotificationType.Info,
      message: 'Rerequesting under development page',
    });

    setUnderDevProjects({ requestStatus: RequestStatus.Loading });
    setUnderDevReload(!underDevReload);
  };

  /* -------------------------------------------------------------------------- */

  return (
    <ProjectListBody>
      <MetaData
        title='My Projects | Kyle Denief'
        description={jsonConfig.pages.blogList.description}
        type='website'
      />

      <PageTitle>Projects</PageTitle>

      <AllProjectsDiv>
        <ProjectsTypeDiv>
          <ProjectsTypeTitle>Under Development</ProjectsTypeTitle>
          <LoadErrorHandle
            requestInfo={underDevProjects}
            successElement={FinishedFetchSuccess}
            retryFunc={UnderDevRetry}
          />
        </ProjectsTypeDiv>

        <ProjectsTypeDiv>
          <ProjectsTypeTitle ref={finishedHeader}>Finished</ProjectsTypeTitle>
          <LoadErrorHandle
            requestInfo={pageFinishedProjects}
            successElement={FinishedFetchSuccess}
            successEffect={{ effect: PageLoadSuccessEffect, callCount: 1 }}
            retryFunc={FinishedPageRetry}
          />
        </ProjectsTypeDiv>
      </AllProjectsDiv>

      {/* Arrows to change finished projects page */}
      <PageChangeDiv>
        <Arrow
          active={+(0 < page)}
          onClick={() => {
            finishedHeader.current?.scrollIntoView();
            changePageNum(false);
          }}
        />
        <PageNum>{page}</PageNum>
        <Arrow
          active={+(maxPage > page)}
          flip={+true}
          onClick={() => {
            finishedHeader.current?.scrollIntoView();
            changePageNum(true);
          }}
        />
      </PageChangeDiv>
    </ProjectListBody>
  );
};

export default ProjectList;
