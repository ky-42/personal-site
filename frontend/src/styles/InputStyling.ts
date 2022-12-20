import { css } from "styled-components";

export const BasicInputStyling = css`
  font-size: 13px;
  padding: 4px 10px 5px 10px;
  margin: 8px 0 0 0;
  border-radius: 5px;
  border: 1px solid ${props => props.theme.darkTone};
  color: ${props => props.theme.lightTone};
  background-color: ${props => props.theme.backgroundColour};
  &:focus {
    color: ${props => props.theme.textColour};
    border: 1px solid ${props => props.theme.highlight};
    outline: none;
  }
`;