import styled from 'styled-components';
import { ContentType, FullContent } from '../../types/Content';
import { Link } from 'react-router-dom';

/* -------------------------------------------------------------------------- */

const ContentLink = styled(Link)`
  // Margin keeps content looking more centered because text is left aligned
  margin-left: clamp(1rem, 5vw, 6rem);
  max-width: 50rem;
  color: ${(props) => props.theme.textColour};
`;
const ContentTitle = styled.h4`
  font-size: clamp(2.08rem, 4vw, 2.56rem);
  font-weight: normal;
  margin: 0;
`;

const ContentCreateDate = styled.p`
  color: ${(props) => props.theme.lightTone};
  margin: 0.3rem 0;
  font-size: clamp(1.12rem, 1.875vw, 1.2rem);
`;

const ContentDesc = styled.p`
  margin: 0;
  font-size: clamp(1.44rem, 2.625vw, 1.68rem);
`;

/* -------------------------------------------------------------------------- */

interface ContentItemProps {
  content: FullContent;
}

const ContentItem = ({ content }: ContentItemProps) => {
  // A Link to a piece of content that also displays info about it

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
  } else {
    ContentDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(content.base_content.created_at);
  }

  return (
    // Links to content is representing in form /content-type/slug
    <ContentLink to={`/${content.base_content.content_type}s/${content.base_content.slug}`}>
      <ContentTitle>{content.base_content.title}</ContentTitle>
      <ContentCreateDate>{ContentDate}</ContentCreateDate>
      <ContentDesc>{content.base_content.description}</ContentDesc>
    </ContentLink>
  );
};

export default ContentItem;
