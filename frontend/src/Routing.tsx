import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/NavBar/NavBar";
import * as Pages from "./pages/PagesExport";

const Routing = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/">
            <Route index element={<Pages.Home />} />
            <Route path="about" element={<Pages.About />} />
            <Route path="connect" element={<Pages.Connect />} />
            <Route path="projects">
              <Route index element={<Pages.ProjectList />} />
              <Route path=":projectSlug" element={<Pages.ProjectView />} />
            </Route>
            <Route path="blogs">
              <Route index element={<Pages.BlogList />} />
              <Route path=":blogSlug" element={<Pages.BlogView />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
      <NavBar />
   </>
   )
};

export default Routing;