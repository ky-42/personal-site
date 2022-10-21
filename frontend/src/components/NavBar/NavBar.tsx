import { useLocation } from "react-router-dom";

import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";
import MobileContext from "../../contexts/Mobile";


const NavBar = () => {
  const location = useLocation();

  return(
    <MobileContext.Consumer>
      {
        // Renders different navbar if on mobile and desktop
        isMobile => isMobile ?
        <MobileNavBar /> : <DesktopNavBar />
      }
    </MobileContext.Consumer>
  )
}

export default NavBar;