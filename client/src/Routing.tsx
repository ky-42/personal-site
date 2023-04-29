import { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PageConfig from './config/PageConfig';
import * as Pages from './pages/_PagesExport';
import LoadingPage from './pages/Loading';

const Routing = () => {
  // Used to force a reload of the content view when the url changes
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path='/' element={<PageConfig />}>
          <Route index element={<Pages.Home />} />
          <Route path='manage' element={<Pages.ManageContent />} />
          <Route path='about' element={<Pages.About />} />
          <Route path='connect' element={<Pages.Connect />} />
          <Route path='projects'>
            <Route index element={<Pages.ProjectList />} />
            <Route path=':slug' element={<Pages.ContentView key={location.key} />} />
          </Route>
          <Route path='blogs'>
            <Route index element={<Pages.BlogList />} />
            <Route path=':slug' element={<Pages.ContentView key={location.key} />} />
          </Route>
          <Route path='*' element={<Pages.NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Routing;
