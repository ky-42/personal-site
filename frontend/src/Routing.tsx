import { Routes, Route } from "react-router-dom";
import * as Pages from "./pages/PagesExport";

const Routing = () => {
  return (
      <Routes>
        <Route path="/">
          <Route index element={<Pages.Home />} />
          <Route path="manage" element={<Pages.ManageContent />} />
          <Route path="about" element={<Pages.About />} />
          <Route path="connect" element={<Pages.Connect />} />
          <Route path="projects">
            <Route index element={<Pages.ProjectList />} />
            <Route path=":slug" element={<Pages.ContentView />} />
          </Route>
          <Route path="blogs">
            <Route index element={<Pages.BlogList />} />
            <Route path=":slug" element={<Pages.ContentView />} />
          </Route>
          <Route path="*" element={<Pages.NotFound />} />
        </Route>
      </Routes>
  )
};

export default Routing;