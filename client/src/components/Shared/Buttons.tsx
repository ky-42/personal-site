import { AiOutlineMinus } from "react-icons/ai"
import { Link } from "react-router-dom";
import styled from "styled-components";

/* ------------------------ General Styled Components ----------------------- */

const ButtonLink = styled(Link)`
  color: ${props => props.theme.textColour};
`;

const TagText = styled.p`
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
`;

/* ------------------------ Tags used on manage page ------------------------ */

const ButtonHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${props => props.theme.lightTone} 0.3rem solid;
  height: 3.5rem;
  padding: 0.05rem 0 0.05rem 0.5rem;

  &:hover {
    text-decoration: underline;
  }
  
  &:active {
    border: ${props => props.theme.highlight} 0.3rem solid;
  }
`;

const DeleteButton = styled.button`
  color: ${props => props.theme.highlight};
  background-color: ${props => props.theme.backgroundColour};
  outline: 0;
  border: 0;
  padding-top: 0.75rem;
  font-size: 1.75rem;
`;

interface ManageTagProps extends TagProps {
  removeTag: (tag: string) => void
}

// Shows a tags and a button to remove it
export const ManageTag = ({tagString: tag, removeTag}: ManageTagProps) => {
  return (
    <ButtonHolder>
      <TagText>
        {tag}
      </ TagText>
      <DeleteButton 
        onClick={() => removeTag(tag)}
      >
        <AiOutlineMinus />
      </DeleteButton>
    </ ButtonHolder>
  )
}

/* --------------------- Tags used on content view page --------------------- */

const TagHolderShow = styled(ButtonHolder)`
  padding: 0.4rem 1rem;
`;

interface TagProps {
  tagString: string,
}

export const ShowTag = ({tagString}: TagProps) => {
  return (
    <ButtonLink to={``}>
      <TagHolderShow>
        <TagText>
          {tagString}
        </ TagText>
      </ TagHolderShow>
    </ButtonLink>
  )
}

/* ---------------- General button used on content view page ---------------- */

const ShowLinkHolder = styled(ButtonHolder)`
  padding: 0 0.8rem;
`;

interface ShowLinkProps {
  button_text: string | JSX.Element,
  url: string
}

export const ShowLink = ({button_text, url}: ShowLinkProps) => {
  return (
    <ButtonLink to={url}>
      <ShowLinkHolder>
        <TagText>
          {button_text}
        </ TagText>
      </ ShowLinkHolder>
    </ButtonLink>
  )
}

/* --- Button for the next and previous devblog links on content view page -- */

const DevblogLinkHolder = styled(ButtonHolder)`
  // When updating this, also update the width of empty divs in ContentView.tsx 
  // when there is no next or previous blog
  height: auto;
  flex-direction: column;
  padding: 0.75rem 0.8rem;
  width: 22.5rem;
  flex-shrink: 0;
  text-wrap: nowrap;
`;

const DevblogLinkText = styled.p`
  font-size: 1.4rem;
  padding: 0;
  margin: 0;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface DevblogLinkProps extends ShowLinkProps {
  isPrevious: boolean
}

export const DevblogLink = ({button_text, url, isPrevious}: DevblogLinkProps) => {
  return(
    <ButtonLink to={url}>
      <DevblogLinkHolder>
        <TagText>
          {isPrevious ? "Previous Blog:" : "Next Blog:"}
        </TagText>
        <br />
        <DevblogLinkText>
          {button_text}
        </ DevblogLinkText>
      </ DevblogLinkHolder>
    </ButtonLink>
  )
}

// Used to keep the spacing of the devblog links consistent
// when there is no next or previous blog
export const EmptyDevblogLink = styled.div`
  width: 24.7rem;

  @media (max-width: 850px) {
    display: none;
  }
`;