import MobileContext from "./contexts/Mobile";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { useWindowSize } from "react-use";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";

const MobileWidth = 700; 

const StyleTheme = {
  mobile: false,
  textColour: "#FFFFFF",
  backgroundColour: "#222629",
  highlight: "#86C232",
  highlightDark: "#61892F",
  lightTone: "#6B6E70",
  darkTone: "#474B4F",
  borderSize: "3px",
  navHeight: "2.81rem"
};

const GlobalCSS = createGlobalStyle`
  body{
    padding: 0;
    margin: 0;
    font-family: 'JetBrainsMono';
    color: ${StyleTheme.textColour}
  }
  
  p {
    font-size: clamp(1rem, 4vw, 1.25rem);
  }

  button {
    font-family: 'JetBrainsMono';
  }
`
const AppConfig = () => {
  const IsMobile = (useWindowSize().width < MobileWidth);
  StyleTheme.mobile = IsMobile;

  return (
    <MobileContext.Provider value={IsMobile}>
      <ThemeProvider theme={StyleTheme}>
        <GlobalCSS />
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </ThemeProvider>
    </MobileContext.Provider>
  )
};

export default AppConfig;