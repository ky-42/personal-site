import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import styled from 'styled-components';

const ContentBody = styled(ReactMarkdown)`
  font-size: clamp(1.68rem, 4vw, 2rem);

  > h1 {
    font-size: clamp(2.48rem, 7vw, 4.48rem);
  }
  > h2 {
    font-size: clamp(2.24rem, 6vw, 3.68rem);
  }
  > h3 {
    font-size: clamp(2rem, 5vw, 2.8rem);
  }
  > h4 {
    font-size: clamp(2rem, 5vw, 2.8rem);
  }
  > h5 {
    font-size: clamp(1.76rem, 4.5vw, 2.24rem);
  }
  > h6 {
    font-size: clamp(1.68rem, 4.25vw, 2rem);
  }
  a {
    color: ${(props) => props.theme.bodyLinkColour};
  }
  a:hover {
    text-decoration: underline;
  }
  a:visited {
    color: ${(props) => props.theme.bodyLinkVisitedColour};
  }
`;

export default ContentBody;
