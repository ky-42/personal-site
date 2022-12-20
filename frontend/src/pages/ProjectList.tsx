import React, {useEffect, useRef, useState} from 'react';
import styled, { css } from "styled-components";
import {AiFillCaretLeft} from "react-icons/ai";

import {GetContentList} from "../adapters/content";
import {FullContentList, listOrder, PageInfo, RequestState, RequestStatus} from "../types/RequestContent";
import {ContentType, ProjectStatus} from "../types/Content";
import PageTitle from "../components/PageTitle";
import ContentListItem from '../components/ContentListItem';
import LoadErrorHandle from '../components/LoadingErrorHandler';
import MetaData from '../components/MetaData';

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
  max-width: 1320px;
  flex-wrap: wrap;
  // Outline covers the outline of the outside of the inside
  // elements border for effect
  outline: 2px solid ${props => props.theme.backgroundColour};
  outline-offset: -1px;
  // Changes number of columns based on screen width
  @media (max-width: 1500px){
    max-width: 880px;
  }
  @media (max-width: 1000px){
    max-width: 440px;
  }
`;

const ProjectsTypeTitle = styled.h2`
  font-size: clamp(1.7rem, 6vw, 2rem);
`;

/* ------------------- Elements for arrows to change pages ------------------ */

const PageChangeDiv = styled.div`
  margin-top: 26px;
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
  font-size: 2.25rem;
  ${props => props.active ? ActiveArrow : DeactiveArrow}
  ${props => props.flip ? FlipCss : ""} 
`;

const PageNum = styled.p`
  margin: 0px 20px;
  font-size: 1.8rem;
`;

/* -------------------------------------------------------------------------- */

const ProjectList = () => {
  
  // TODO Fix finished list when there are 3 items is weird and wraps early
  // event though its the same as the under dev list
  // 
  const contentPerPage = 6;
  
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  const [underDevProjects, setUnderDevProjects] = useState<RequestState<FullContentList>>({requestStatus: RequestStatus.Loading});
  
  const [pageFinishedProjects, setPageFinishedProjects] = useState<RequestState<FullContentList>>({requestStatus: RequestStatus.Loading});
  const [fetchedFinishedProjects, setFetchedFinishedProjects] = useState<Record<number, RequestState<FullContentList>>>({});

  // Used to scroll to top of list of projects when page changes and top
  // is out of view
  const finishedHeader = useRef<HTMLHeadingElement>(null);

  // Object passed to reuqest for proper paging of projects
  const pageInfo: PageInfo = {
    content_per_page: contentPerPage,
    page,
    show_order: listOrder.Newest  
  };

  // Makes sure page dosent go negative or past the max page
  const changePageNum = (change: boolean) => {
    if (
      (page > 0 && !change) ||
      (maxPage > page && change)
    ){
      change ? setPage(page + 1) : setPage(page - 1);
    }
  }
  
  /* ------------------- useEffect functions to reuqest data ------------------ */
  
  // Gets under dev projects and gets max page
  useEffect(() => {
    GetContentList({
      page_info: pageInfo,
      content_filters: {
        content_type: ContentType.Project,
        project_status: ProjectStatus.UnderDevelopment
      }
    }). then((value) => {
      setUnderDevProjects(value);
    })
  }, []);
  
  // Gets the current pages finished projects
  useEffect(() => {
    // Checks if the page the user is on was already fetched
    if (fetchedFinishedProjects[page] === undefined) {
      GetContentList({
        page_info: pageInfo,
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
  }, [page]);
  
  /* ------------------------ Request succses functions ----------------------- */

  const FinishedFetchSuccess = ({data}: {data: FullContentList}) => {
    // Use effect removes warning about setting data while still rendering
    useEffect(() => setMaxPage(Math.ceil(data.content_count/contentPerPage)-1));
    return listFetchSuccess({data});    
  }

  // What element to show when fetch requests for projects lists succeed
  const listFetchSuccess = ({data}: {data: FullContentList}) => {
    return (
      <ContentList>
        {
          data.full_content_list.map(gotProjects => {
            return <ContentListItem content={gotProjects} key={gotProjects.base_content.id} />
          })
        }
      </ContentList>
    );
  }
  
  /* -------------------------------------------------------------------------- */
  
  return (
    <ProjectListBody>
    
      <MetaData
        title="My Projects | Kyle Denief"
        description="A list of my projects! Some are finished and some arn't"
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
          <LoadErrorHandle requestInfo={underDevProjects} successElement={listFetchSuccess} />
        </ProjectsTypeDiv>

        <ProjectsTypeDiv>
          <ProjectsTypeTitle ref={finishedHeader}>
            Finished
          </ProjectsTypeTitle>
          <LoadErrorHandle requestInfo={pageFinishedProjects} successElement={FinishedFetchSuccess} />
        </ProjectsTypeDiv>

      </AllProjectsDiv>

      {/* Arrows to change finished projects page */}
      <PageChangeDiv>
        <Arrow active={+(0 !== page)} onClick={() => {finishedHeader.current?.scrollIntoView(); changePageNum(false)}} />
        <PageNum>
          {page + 1}
        </PageNum>
        <Arrow active={+(maxPage !== page)} flip={+true} onClick={() => {finishedHeader.current?.scrollIntoView(); changePageNum(true)}} />
      </PageChangeDiv>

    </ProjectListBody>
  )
}

export default ProjectList;