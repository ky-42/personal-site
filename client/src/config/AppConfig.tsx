import { ThemeProvider, createGlobalStyle } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import MobileContext from "../contexts/Mobile";
import Routing from "../Routing";
import { HelmetProvider } from "react-helmet-async";
import useWindowSize from "../hooks/useWindowSize";
import jsonConfig from "@config/config.json";

// Size in px at which site starts using mobile features
const MobileWidth = 700; 

// Stlyes to pass to all components
const StyleTheme = {
  mobile: false,
  borderSize: "0.3rem",
  navHeight: "4.496rem",
  ...jsonConfig.colours,
};

const GlobalCSS = createGlobalStyle`

  Html {
    font-size: 10px;
  }

  body{
    margin: 0;
    font-family: 'JetBrainsMono';
    color: ${StyleTheme.textColour};
    background-color: ${StyleTheme.backgroundColour};
    font-size: 1.6rem;
  }
  
  p {
    font-size: clamp(1.6rem, 4vw, 2.0rem);
  }

  button {
    font-family: 'JetBrainsMono';
  }
  
  h1 {
    text-decoration: underline ${StyleTheme.highlight};
    text-underline-offset: clamp(0.3rem, 2vw, 1.5rem);
    line-height: 150%;
  }
  
  h2 {
    text-decoration: underline ${StyleTheme.highlightDark};
    text-underline-offset: 0.64rem;
    line-height: 155%;
  }
  
  h3 {
    text-decoration: underline ${StyleTheme.highlightDark};
    text-underline-offset: 0.64rem;
    line-height: 150%;
  }

  h4, h5, h6 {
    text-decoration: underline ${StyleTheme.textColour}
  }
  
  a {
    text-decoration: none;
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
          <HelmetProvider>
            <Routing />
          </HelmetProvider>
        </BrowserRouter>
      </ThemeProvider>
    </MobileContext.Provider>
  )
};

export default AppConfig;