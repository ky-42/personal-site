import MobileContext from "../../contexts/Mobile";
import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";

const NavBar = () => {
  return (
    <MobileContext.Consumer>
      {
        // Renders different navbar if on mobile and desktop
        (isMobile) => (isMobile ? <MobileNavBar /> : <DesktopNavBar />)
      }
    </MobileContext.Consumer>
  );
};

export default NavBar;
