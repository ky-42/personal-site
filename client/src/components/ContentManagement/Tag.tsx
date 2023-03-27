import { AiOutlineMinus } from "react-icons/ai"
import styled from "styled-components";

/* ---------------------------- Styled Components --------------------------- */

const TagHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${props => props.theme.lightTone} 0.2rem solid;
  height: 3.5rem;
  padding: 0.05rem 0 0.05rem 0.5rem;
`;

const TagText = styled.p`
  font-size: 1.5rem;
  margin: 0;
`;

const DeleteButton = styled.button`
  color: ${props => props.theme.highlight};
  background-color: ${props => props.theme.backgroundColour};
  outline: 0;
  border: 0;
  padding-top: 0.75rem;
  font-size: 1.75rem;
`;

/* -------------------------------------------------------------------------- */

interface TagProps {
  tagString: string,
  removeTag: (tag: string) => void
}

// Shows a tags and a button to remove it
const Tag = ({tagString: tag, removeTag}: TagProps) => {
  return (
    <TagHolder>
      <TagText>
        {tag}
      </ TagText>
      <DeleteButton 
        onClick={() => removeTag(tag)}
      >
        <AiOutlineMinus />
      </DeleteButton>
    </ TagHolder>
  )
}

export default Tag;