import styled from "styled-components";
import { BasicInputStyling } from "../../styles/InputStyling";

/* ----------------------------- Input elements ----------------------------- */

export const LongTextInput = styled.textarea`
  ${BasicInputStyling}
  height: 32.5rem;
  width: 65.0rem;
  margin: 1.2rem 2.5rem;
`;

export const ShortTextInput = styled.input`
  ${BasicInputStyling}
  max-width: 50.0rem;
  height: 2.0rem;
`;

export const DropDown = styled.select`
  ${BasicInputStyling}
  max-width: 50.0rem;
  height: 3.0rem;
`;

export const StyledButton = styled.button`
  ${BasicInputStyling}
  color: ${props => props.theme.textColour};
  border: 0.1rem solid ${props => props.theme.highlight};

  &:active {
    border: 0.1rem solid ${props => props.theme.darkTone};
    color: ${props => props.theme.lightTone};
  }
`;

/* ------------------ Input element organizers and wrappers ----------------- */

export const InputSection = styled.section`
  margin: 5.0rem 0;
`;

export const SectionTitle = styled.h2`
  text-align: center;
`;

export const InputGroup = styled.div`
  display: flex;
  column-gap: 5.0rem;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;
