import { ThemeProvider, createGlobalStyle } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { useWindowSize } from "react-use";
import MobileContext from "./contexts/Mobile";
import Routing from "./Routing";

// Size in px at which site starts using mobile features
const MobileWidth = 700; 

// Stlyes to pass to all components
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
    margin: 0;
    font-family: 'JetBrainsMono';
    color: ${StyleTheme.textColour};
    background-color: ${StyleTheme.backgroundColour}
  }
  
  p {
    font-size: clamp(1rem, 4vw, 1.25rem);
  }

  button {
    font-family: 'JetBrainsMono';
  }
`
const AppConfig = () => {
  // Sets config for things that will effect or be used by all pages

  // Checks if screen is of mobile width 
  StyleTheme.mobile = (useWindowSize().width < MobileWidth);

  return (
    <MobileContext.Provider value={StyleTheme.mobile}>
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