import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import styled, { css } from "styled-components";
import {CountContentType, GetContentList, UnderDevProjects} from "../adapters/content";
import {listOrder} from "../types/ViewContent";
import {ContentType, FullContent} from "../types/Content";
import PageTitle from "../components/PageTitle";
import ContentListItem from '../components/ContentListItem';
import {AiFillCaretLeft} from "react-icons/ai";

const ProjectListDiv = styled.div`
  margin-bottom: 40px;
`;

const AllProjectsDiv = styled.div`

`;

const ProjectsTypeDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentList = styled.div`
  width: 100%;
  max-width: 1320px;
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  outline: 2px solid ${props => props.theme.backgroundColour};
  outline-offset: -1px;
  @media (max-width: 1500px){
    max-width: 880px;
  }
  @media (max-width: 1000px){
    max-width: 440px;
  }
`;

const ProjectsTypeTitle = styled.h2`
  text-decoration: underline ${props => props.theme.highlightDark};
  font-size: clamp(1.7rem, 6vw, 2rem);
  text-underline-offset: 0.5rem;
  text-align: center;
`;

const PageChangeDiv = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FlipCss = css`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`

const ActiveArrow = css`
  cursor: pointer;
  color: ${props => props.theme.lightTone};
  &:hover{
    color: ${props => props.theme.highlight};
  }
`

const DeactiveArrow = css`
  color: ${props => props.theme.darkTone};
`;

const Arrow = styled(AiFillCaretLeft)<{active: number, flip?: number}>`
  font-size: 2.25rem;
  ${props => props.active ? ActiveArrow : DeactiveArrow}
  ${props => props.flip ? FlipCss : ""} 
`;

const PageNum = styled.p`
  margin: 0px 20px;
  font-size: 1.8rem;
`;

const HeightHolder = styled.div`
  height: 360px;
  @media (max-width: 1500px){
    height: 540px;
  }
  @media (max-width: 1000px){
    height: 1080px;
  }
`;


const ProjectList = () => {
  
  // TODO Fix finished list when there are 3 items is weird and wraps early
  // event though its the same as the under dev list
  
  const content_per_page = 6;

  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [finishedProjects, setFinishedProjects] = useState<FullContent[][]>([]);
  const [underDevProjects, setUnderDevProjects] = useState<FullContent[]>([]);

  const finishedHeader = useRef<HTMLHeadingElement>(null);

  const changePageNum = (change: boolean) => {
    if (
      (page !== 0 && !change) ||
      (maxPage !== page && change)
    ){
      change ? setPage(page + 1) : setPage(page - 1);
    }
  }
  
  const scrollToFinished = () => {
    if (window.innerWidth <= 1000) {
      finishedHeader.current?.scrollIntoView()
    }
  }
  
  // For under dev projects and getting max page count
  useEffect(() => {
    UnderDevProjects().then((value) => {
      CountContentType(ContentType.Project).then((projectCount) => {
        setMaxPage(Math.ceil(projectCount/content_per_page)-1);
      });
      setUnderDevProjects(value);
    });
  }, []);
  
  useEffect(() => {
    if (page === finishedProjects.length) {
      GetContentList({
        content_per_page,
        page,
        show_order: listOrder.Newest,
        content_type: ContentType.Project
      }).then((value) => {
        setFinishedProjects([...finishedProjects, value]);
      });
    }
  }, [page]);
  
  // Used to hold div hight will projects are being fetched
  const SetFinishedList = () => {
    if (typeof finishedProjects[page] !== "undefined") {
      return finishedProjects[page].flat().map(gotProjects => {
        return <ContentListItem content={gotProjects} key={gotProjects.base_content.id} />;
      })
    } else {
      return <HeightHolder />;
    }
  }
  
  return (
    <ProjectListDiv>
      <PageTitle>
        Projects
      </PageTitle>
      <AllProjectsDiv>
        <ProjectsTypeDiv>
          <ProjectsTypeTitle>
            Under Development
          </ProjectsTypeTitle>
          <ContentList>
            {
              underDevProjects.map(gotProjects => {
                return <ContentListItem content={gotProjects} key={gotProjects.base_content.id} />
              })
            }
          </ContentList>
        </ProjectsTypeDiv>
        <ProjectsTypeDiv>
          <ProjectsTypeTitle ref={finishedHeader}>
            Finished
          </ProjectsTypeTitle>
          <ContentList>
            {
              SetFinishedList()
            }
          </ContentList>
        </ProjectsTypeDiv>
      </AllProjectsDiv>
      <PageChangeDiv>
        <Arrow active={+(0 !== page)} onClick={() => {scrollToFinished(); changePageNum(false)}} />
        <PageNum>
          {page + 1}
        </PageNum>
        <Arrow active={+(maxPage !== page)} flip={+true} onClick={() => {scrollToFinished(); changePageNum(true)}} />
      </PageChangeDiv>
    </ProjectListDiv>
  )
}

export default ProjectList;