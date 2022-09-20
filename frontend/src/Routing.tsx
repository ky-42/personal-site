import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/NavBar/NavBar";
import * as Pages from "./pages/PagesExport";
import { ContentTypes } from "./types/Content";


const Routing = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/">
            <Route index element={<Pages.Home />} />
            <Route path="manage" element={<Pages.ManageContent />} />
            <Route path="about" element={<Pages.About />} />
            <Route path="connect" element={<Pages.Connect />} />
            <Route path="projects">
              <Route index element={<Pages.ContentList content_type={ContentTypes.Project} />} />
              <Route path=":projectSlug" element={<Pages.ContentView />} />
            </Route>
            <Route path="blogs">
              <Route index element={<Pages.ContentList content_type={ContentTypes.Blog} />} />
              <Route path=":blogSlug" element={<Pages.ContentView />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
      <NavBar />
   </>
   )
};

export default Routing;