import styled from 'styled-components';
import { ContentType, FullContent } from '../../types/Content';
import { Link } from 'react-router-dom';

/* -------------------------------------------------------------------------- */

// start column two and three are used to position the content item within the grid
const ContentItemDiv = styled(Link)<{ startcolumntwo?: number; startcolumnthree?: number }>`
  display: flex;
  flex-direction: column;
  grid-column: ${(props) => (props.startcolumnthree ? `${props.startcolumnthree} / ` : '')} span 2;
  max-width: 40rem;
  height: 14rem;
  padding: 2rem;
  color: ${(props) => props.theme.textColour};
  outline: 0.2rem solid ${(props) => props.theme.darkTone};
  outline-offset: -0.1rem;

  @media (max-width: 1500px) {
    grid-column: ${(props) => (props.startcolumntwo ? '2 / ' : '')} span 2;
  }

  // In single column lets item grow vertically and centers it
  @media (max-width: 1000px) {
    grid-column: 1 / span 2;
    height: auto;
    min-height: 7.5rem;
    // Lets content shrink horizontally
    justify-content: center;
    overflow: auto;
  }
`;

const ItemTitle = styled.h4`
  font-size: 2rem;
  font-weight: normal;
  margin: 0;
  // Keeps title from overflowing
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  // Increases max number of lines when there is one column
  @media (max-width: 1000px) {
    -webkit-line-clamp: 4;
  }
`;

const ItemDate = styled.p`
  color: ${(props) => props.theme.lightTone};
  margin: 0.3rem 0;
  font-size: clamp(0.96rem, 2.5vw, 1.2rem);
`;

const ItemDesc = styled.p`
  margin: 0;
  font-size: 1.6rem;
  // Keeps description from overflowing
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* -------------------------------------------------------------------------- */

export const getColumnStart = (
  index: number,
  fullListLength: number,
  width: number,
): undefined | number => {
  const diff = fullListLength - index;
  const leftOver = fullListLength % width;
  if (diff <= leftOver) {
    switch (width) {
      case 2:
        return 2;
      case 3:
        if (leftOver === 1) {
          return 3;
        } else if (leftOver === 2) {
          if (diff === 1) {
            return 4;
          } else if (diff === 2) {
            return 2;
          }
        }
    }
  }
  return undefined;
};

/* -------------------------------------------------------------------------- */

interface ContentItemProps {
  content: FullContent;
  startColumnTwo?: number;
  startColumnThree?: number;
}

const ContentListItem = ({ content, startColumnTwo, startColumnThree }: ContentItemProps) => {
  // Link to a peice of content that also displays info about it
  // For project list and blog list page

  // Creates readable date string for the date the content was created
  // so it can be shown
  let ContentDate: string;

  if (
    content.base_content.content_type === ContentType.Project &&
    'project' in content.extra_content &&
    content.extra_content.project.start_date !== undefined
  ) {
    ContentDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(content.extra_content.project.start_date);

    ContentDate = `Started On: ${ContentDate}`;
  } else {
    ContentDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(content.base_content.created_at);

    if (content.base_content.content_type === ContentType.Project) {
      ContentDate = `Posted On: ${ContentDate}`;
    }
  }

  return (
    // Links to content is representing in form /content-type/slug
    <ContentItemDiv
      to={`/${content.base_content.content_type}s/${content.base_content.slug}`}
      startcolumntwo={startColumnTwo}
      startcolumnthree={startColumnThree}
    >
      <ItemTitle>{content.base_content.title}</ItemTitle>
      <ItemDate>{ContentDate}</ItemDate>
      <ItemDesc>{content.base_content.content_desc}</ItemDesc>
    </ContentItemDiv>
  );
};

export default ContentListItem;
