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
    backgroundColour: "#303030",
    textColour: "#FFFFFF",
    smallTextColour: "#D5D5D5"
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