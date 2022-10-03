import MobileContext from "./contexts/Mobile";
import Routing from "./Routing";
import { ThemeProvider } from "styled-components";
import { useWindowSize } from "react-use";
import { BrowserRouter } from "react-router-dom";

const MobileWidth = 700; 

const AppConfig = () => {
  const IsMobile = (useWindowSize().width < MobileWidth);
  const StlyeTheme = {
    mobile: IsMobile,
    backgroundColour: "#212121",
    highlightColour: "#FF3F3F",
    textColour: "#D0D0D0",
    smallTextColour: "#6BAA75"
  };

  return (
    <MobileContext.Provider value={IsMobile}>
      <ThemeProvider theme={StlyeTheme}>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </ThemeProvider>
    </MobileContext.Provider>
  )
};

export default AppConfig;