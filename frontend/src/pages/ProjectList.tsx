import React, {useEffect, useRef, useState} from 'react';
import styled, { css } from "styled-components";
import {AiFillCaretLeft} from "react-icons/ai";

import {CountContentType, GetContentList, UnderDevProjects} from "../adapters/content";
import {listOrder, RequestState, RequestStatus} from "../types/RequestContent";
import {ContentType, FullContent} from "../types/Content";
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
  
  const content_per_page = 6;

  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  const [underDevProjects, setUnderDevProjects] = useState<RequestState<FullContent[]>>({requestStatus: RequestStatus.Loading});
  
  const [pageFinishedProjects, setPageFinishedProjects] = useState<RequestState<FullContent[]>>({requestStatus: RequestStatus.Loading});
  const [fetchedFinishedProjects, setFetchedFinishedProjects] = useState<Record<number, RequestState<FullContent[]>>>({});

  // This and func below used to scroll to top of list of projects
  // when there is on column 
  const finishedHeader = useRef<HTMLHeadingElement>(null);
  
  const scrollToFinished = () => {
    if (window.innerWidth <= 1000) {
      finishedHeader.current?.scrollIntoView()
    }
  }

  // Makes sure page dosent go negative or past the max page
  const changePageNum = (change: boolean) => {
    if (
      (page > 0 && !change) ||
      (maxPage > page && change)
    ){
      change ? setPage(page + 1) : setPage(page - 1);
    }
  }
  
  // Gets under dev projects and gets max page
  useEffect(() => {

    UnderDevProjects().then(value => setUnderDevProjects(value));

    CountContentType(ContentType.Project).then((projectCount) => {
      // Error handling for max page count
      switch (projectCount.requestStatus){
        case RequestStatus.Error:
          // TODO make notification to user that this happend
          setMaxPage(1000);
          break;
        case RequestStatus.Success:
          setMaxPage((Math.ceil(projectCount.requestedData/content_per_page)-1));
          break;
      }
    });

  }, []);
  
  // Gets the current pages finished projects
  useEffect(() => {
    // Checks if the page the user is on was already fetched
    if (fetchedFinishedProjects[page] === undefined) {
      GetContentList({
        content_per_page,
        page,
        show_order: listOrder.Newest,
        content_type: ContentType.Project
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
  
  // What element to show when fetch requests for projects lists succeed
  const listFetchSuccess = (data: FullContent[]) => {
    return (
      <ContentList>
        {
          data.map(gotProjects => {
            return <ContentListItem content={gotProjects} key={gotProjects.base_content.id} />
          })
        }
      </ContentList>
    );
  }
  
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
          <LoadErrorHandle requestInfo={underDevProjects} successCallback={listFetchSuccess} />
        </ProjectsTypeDiv>

        <ProjectsTypeDiv>
          <ProjectsTypeTitle ref={finishedHeader}>
            Finished
          </ProjectsTypeTitle>
          <LoadErrorHandle requestInfo={pageFinishedProjects} successCallback={listFetchSuccess} />
        </ProjectsTypeDiv>

      </AllProjectsDiv>

      {/* Arrows to change finished projects page */}
      <PageChangeDiv>
        <Arrow active={+(0 !== page)} onClick={() => {scrollToFinished(); changePageNum(false)}} />
        <PageNum>
          {page + 1}
        </PageNum>
        <Arrow active={+(maxPage !== page)} flip={+true} onClick={() => {scrollToFinished(); changePageNum(true)}} />
      </PageChangeDiv>

    </ProjectListBody>
  )
}

export default ProjectList;