import styled, { css } from "styled-components";
import { BasicInputStyling } from "../../styles/InputStyling";

/* ----------------------------- Input elements ----------------------------- */

export const LongTextInput = styled.textarea`
  ${BasicInputStyling}
  height: 325px;
  width: 650px;
  margin: 12px 25px;
`;

export const ShortTextInput = styled.input`
  ${BasicInputStyling}
  max-width: 500px;
  height: 20px;
`;

export const DropDown = styled.select`
  ${BasicInputStyling}
  max-width: 500px;
  height: 30px;
`;

export const StyledButton = styled.button`
  ${BasicInputStyling}
  color: ${props => props.theme.textColour};
  border: 1px solid ${props => props.theme.highlight};

  &:active {
    border: 1px solid ${props => props.theme.darkTone};
    color: ${props => props.theme.lightTone};
  }
`;

/* ------------------ Input element organizers and wrappers ----------------- */

export const InputSection = styled.section`
  margin: 50px 0;
`;

export const SectionTitle = styled.h2`
  text-align: center;
`;

export const InputGroup = styled.div`
  display: flex;
  column-gap: 50px;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;
