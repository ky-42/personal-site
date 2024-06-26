import styled from 'styled-components';

/* -------------------------------------------------------------------------- */

const Container = styled.div`
  display: flex;
  flex: 0 0 1;
  flex-direction: column;
  width: 100%;
  max-width: 55rem;
  /* margin-bottom: 1.5rem; */
`;

const ContainerHeader = styled.h2`
  text-align: center;
`;

/* -------------------------------------------------------------------------- */

interface ContentContainerProps {
  containerTitle: string;
  housedElement: React.ReactNode;
}

const ContentContainer = ({ containerTitle, housedElement }: ContentContainerProps) => {
  // Creates a container that will house another element with a title added above element
  // used for showing info about a piece of content and linking to it
  return (
    <Container>
      <ContainerHeader>{containerTitle}</ContainerHeader>
      {housedElement}
    </Container>
  );
};

export default ContentContainer;
