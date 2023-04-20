import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import styled, { css } from "styled-components";
import {AiFillCaretLeft} from "react-icons/ai";

import {ContentOperations} from "../adapters/content";
import {FullContentList, listOrder, RequestState, RequestStatus} from "../types/RequestContent";
import {ContentType, ProjectStatus} from "../types/Content";
import PageTitle from "../components/Shared/PageTitle";
import ContentListItem from '../components/ContentShow/ContentListItem';
import LoadErrorHandle from '../components/RequestHandling/LoadingErrorHandler';
import MetaData from '../components/Shared/MetaData';
import { NavigationType, useNavigationType } from 'react-router-dom';
import { jsonParser } from '../adapters/helpers';
import jsonConfig from '@config/config.json';

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
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 132.0rem;
  flex-wrap: wrap;
  // Outline covers the outline of the outside of the inside
  // elements border for effect
  outline: 0.2rem solid ${props => props.theme.backgroundColour};
  outline-offset: -0.1rem;
  // Changes number of columns based on screen width
  @media (max-width: 1500px){
    max-width: 88.0rem;
  }
  @media (max-width: 1000px){
    max-width: 44.0rem;
  }
`;

const ProjectsTypeTitle = styled.h2`
  font-size: clamp(2.72rem, 6vw, 3.2rem);
`;

/* ------------------- Elements for arrows to change pages ------------------ */

const PageChangeDiv = styled.div`
  margin-top: 3.0rem;
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
  color: ${props => props.theme.lightTone};
  &:hover{
    color: ${props => props.theme.highlight};
  }
`;

const DeactiveArrow = css`
  color: ${props => props.theme.darkTone};
`;
/* -------------------------------------------------------------------------- */

const Arrow = styled(AiFillCaretLeft)<{active: number, flip?: number}>`
  font-size: 3.6rem;
  ${props => props.active ? ActiveArrow : DeactiveArrow}
  ${props => props.flip ? FlipCss : ""} 
`;

const PageNum = styled.p`
  margin: 0.0rem 2.0rem;
  font-size: 2.88rem;
`;

/* -------------------------------------------------------------------------- */

const ProjectList = () => {
  
  // TODO Fix finished list when there are 3 items is weird and wraps early
  // event though its the same as the under dev list
  
  const contentPerPage = 6;
  
  // Used to determine if user navigated backwards
  const navigationType = useNavigationType();
  
  // Uses sessionStorage to keep state when user navigates back
  const [page, setPage] = useState(
    sessionStorage.getItem("projectListPage") && navigationType === NavigationType.Pop
    ? parseInt(sessionStorage.getItem("projectListPage")!)
    : 0
  );
  const [maxPage, setMaxPage] = useState(0);

  // Uses sessionStorage to keep state when user navigates back
  const [underDevProjects, setUnderDevProjects] = useState<RequestState<FullContentList>>(
    sessionStorage.getItem("projectListUnderDev") && navigationType === NavigationType.Pop
    ? JSON.parse(sessionStorage.getItem("projectListUnderDev") as string, jsonParser)
    : {requestStatus: RequestStatus.Loading}
  );
  // Needed cause no depedencies for under dev useEffect and
  // no clear thing to add there so this will reload the page
  // for under dev
  const [underDevReload, setUnderDevReload] = useState(false);
  
  // Uses sessionStorage to keep state when user navigates back
  const [pageFinishedProjects, setPageFinishedProjects] = useState<RequestState<FullContentList>>(
    sessionStorage.getItem("projectListFinishedPage") && navigationType === NavigationType.Pop
    ? JSON.parse(sessionStorage.getItem("projectListFinishedPage") as string, jsonParser)
    : {requestStatus: RequestStatus.Loading}
  );
  const [fetchedFinishedProjects, setFetchedFinishedProjects] = useState<Record<number, RequestState<FullContentList>>>({});

  // Used to scroll to top of list of projects when page changes and top
  // is out of view
  const finishedHeader = useRef<HTMLHeadingElement>(null);

  // Makes sure page dosent go negative or past the max page
  const changePageNum = (change: boolean) => {
    if (
      (page > 0 && !change) ||
      (maxPage > page && change)
    ){
      change ? setPage(page + 1) : setPage(page - 1);
    }
  }
  
  /* ----------------------------- Unmount effects ---------------------------- */

  useEffect(() => {
    return () => {
      sessionStorage.setItem("projectListPage", page.toString());
      sessionStorage.setItem("projectListFinishedPage", JSON.stringify(pageFinishedProjects));
      sessionStorage.setItem("projectListUnderDev", JSON.stringify(underDevProjects));
    }
  }, [page]);

  /* ------------------- useEffect functions to reuqest data ------------------ */
  
  // Gets under dev projects and gets max page
  useEffect(() => {
    ContentOperations.get_content_list({
      page_info: {
        content_per_page: 12,
        page: 0,
        show_order: listOrder.ProjectStartNewest  
      },
      content_filters: {
        content_type: ContentType.Project,
        project_status: ProjectStatus.UnderDevelopment
      }
    }).then((value) => {
      setUnderDevProjects(value);
    })
  }, [underDevReload]);
  
  // Gets the current pages finished projects
  useEffect(() => {
    // Checks if the page the user is on was already fetched
    if (fetchedFinishedProjects[page] === undefined) {
      ContentOperations.get_content_list({
        page_info: {
          content_per_page: contentPerPage,
          page,
          show_order: listOrder.ProjectStartNewest  
        },
        content_filters: {
          content_type: ContentType.Project,
          project_status: ProjectStatus.Finished
        }
      }).then((value) => {
        // Sets fetched content to the value to show on the current page
        setPageFinishedProjects(value);
        // Saves content incase user returns to this page
        setFetchedFinishedProjects((projectsListRecord) => {
          projectsListRecord[page] = value;
          return projectsListRecord;
        })
      });
    } else {
      // Uses old data if page was requested before
      setPageFinishedProjects(fetchedFinishedProjects[page]);
    };
  }, [page, fetchedFinishedProjects]);
  
  /* ------------------------ Request succses functions ----------------------- */

  // Side effect of request success should only run once and for finished projects
  const PageLoadSuccessEffect = ({data}: {data: FullContentList}) => {
    setMaxPage(Math.ceil(data.content_count/contentPerPage)-1);
  };

  // What element to show when fetch requests for projects lists succeed
  const FinishedFetchSuccess = ({data}: {data: FullContentList}) => {
    return (
      <ContentList>
        {
          // Makes sure there are projects to display
          data.content_count > 0 ?
            data.full_content_list.map(gotProjects => {
              return <ContentListItem content={gotProjects} key={gotProjects.base_content.id} />
            })
          :
            <p>No Projects</p>
        }
      </ContentList>
    );
  };
  
  /* ------------------------- Request error functions ------------------------ */
  // Function reload current page of projects for there respective sections
  
  const FinishedPageRetry = () => {
    // Works cause this is watched by useEffect
    setFetchedFinishedProjects((state) => {
      delete state[page];
      return {...state};
    });
  };

  const UnderDevRetry = () => {
    setUnderDevReload(!underDevReload);
  };
  
  /* -------------------------------------------------------------------------- */
  
  return (
    <ProjectListBody>
    
      <MetaData
        title="My Projects | Kyle Denief"
        description={jsonConfig.pages.blogList.description}
        type="website"
      />

      <PageTitle>
        Projects
      </PageTitle>

      <AllProjectsDiv>

        <ProjectsTypeDiv>
          <ProjectsTypeTitle>
            Under Development
          </ProjectsTypeTitle>
          <LoadErrorHandle
            requestInfo={underDevProjects}
            successElement={FinishedFetchSuccess}
            retryFunc={UnderDevRetry}
          />
        </ProjectsTypeDiv>

        <ProjectsTypeDiv>
          <ProjectsTypeTitle ref={finishedHeader}>
            Finished
          </ProjectsTypeTitle>
          <LoadErrorHandle
            requestInfo={pageFinishedProjects}
            successElement={FinishedFetchSuccess}
            successEffect={{effect: PageLoadSuccessEffect, callCount: 1}}
            retryFunc={FinishedPageRetry}
          />
        </ProjectsTypeDiv>

      </AllProjectsDiv>

      {/* Arrows to change finished projects page */}
      <PageChangeDiv>
        <Arrow active={+(0 !== page)} onClick={() => {finishedHeader.current?.scrollIntoView(); changePageNum(false)}} />
        <PageNum>
          {page}
        </PageNum>
        <Arrow active={+(maxPage !== page)} flip={+true} onClick={() => {finishedHeader.current?.scrollIntoView(); changePageNum(true)}} />
      </PageChangeDiv>

    </ProjectListBody>
  )
}

export default ProjectList;