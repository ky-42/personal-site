import styled, { css } from "styled-components";

/* ------------------------------ Input Styling ----------------------------- */

export const BasicInputStyling = css`
  font-size: 1.3rem;
  padding: 0.4rem 1.0rem 0.5rem 1.0rem;
  margin: 0.8rem 0 0 0;
  border-radius: 0.5rem;
  border: 0.1rem solid ${props => props.theme.darkTone};
  color: ${props => props.theme.lightTone};
  background-color: ${props => props.theme.backgroundColour};
  max-width: 100%;
  &:focus {
    color: ${props => props.theme.textColour};
    border: 0.1rem solid ${props => props.theme.highlight};
    outline: none;
  }
`;

// Styling for text relating to and error
export const ErrorTextStyling = css`
  color: ${props => props.theme.errorColour};
  &:focus {
    color: ${props => props.theme.errorColour};
  }
  &:active {
    color: ${props => props.theme.errorColour};
  }
`;

const ActiveButton = css`
  /* Important needed to overide any focus styles */
  color: ${props => props.theme.textColour} !important;
  border: 0.1rem solid ${props => props.theme.highlight} !important;
`;

const UnactiveButton = css`
  border: 0.1rem solid ${props => props.theme.darkTone};
  color: ${props => props.theme.lightTone};
  &:focus {
    border: 0.1rem solid ${props => props.theme.darkTone};
    color: ${props => props.theme.lightTone};
  }
`;

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

export const BasicButton = styled.button`
  ${BasicInputStyling}
  width: 20.0rem;
  font-size: 1.6rem;
`;

export const ClickButton = styled(BasicButton)`
  &:focus {
    ${UnactiveButton}
  }
  
  &:active {
    ${ActiveButton}    
  }
`;

export const StateButton = styled(BasicButton)<{active: Boolean}>`
  ${props => props.active ? ActiveButton : UnactiveButton}
`;

export const EnterButton = styled(StyledButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 1.0rem;
  height: 3.0rem;
  width: 3.0rem;
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
