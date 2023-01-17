import { css } from "styled-components";

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