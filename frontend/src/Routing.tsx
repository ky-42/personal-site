import React from "react";
import { Routes, Route } from "react-router-dom";
import PageConfig from "./PageConfig";
import * as Pages from "./pages/PagesExport";

const Routing = () => {
  return (
    // TODO create loading page that will only show if loading takes a certain amount of time
    <React.Suspense fallback={<></>}>
      <Routes>
        <Route path="/" element={<PageConfig />}>
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
    </React.Suspense>
  )
};

export default Routing;