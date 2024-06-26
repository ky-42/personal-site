import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';

const LinkDiv = styled(NavLink)`
  background-color: ${(props) => props.theme.backgroundColour};
  width: 100%;
  height: 100%;
`;

// Needed to create hover effect because otherwise there would be
// Double border width between items in the flex box
const HoverDiv = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.active ? props.theme.textColour : props.theme.lightTone)};
  outline: ${(props) =>
    props.active ? `${props.theme.borderSize} solid ${props.theme.highlight}` : 'none'};
  &:hover {
    color: ${(props) => props.theme.textColour};
    text-decoration: underline;
  }
`;

const LinkText = styled.h3`
  font-size: clamp(1.76rem, 2vw, 2.08rem);
  text-decoration: none;
`;

interface LinkNavBarProps {
  to: string;
  title: string;
}

const LinkNavBar = ({ to, title }: LinkNavBarProps) => {
  // Used to check if the link is for the current page
  const location = useLocation().pathname;
  const active = location === to;

  return (
    <LinkDiv to={to}>
      <HoverDiv active={active}>
        <LinkText>{title}</LinkText>
      </HoverDiv>
    </LinkDiv>
  );
};

export default LinkNavBar;
