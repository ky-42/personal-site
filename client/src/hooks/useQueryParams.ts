import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type useQueryReturn = [
  URLSearchParams,
  (query: URLSearchParams) => void,
  (query: URLSearchParams) => void,
];

// Used to get and manipulate the query params
const useQuery = (): useQueryReturn => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  // Used to get the query params
  const params = useMemo(() => new URLSearchParams(search), [search]);

  // Used to replace the query params so that it doesn't add to the history
  const replaceQuery = (query: URLSearchParams) => {
    navigate(`${pathname}?${query.toString()}`, {
      replace: true,
    });
  };

  // Used to set the query params so that it adds to the history
  const setQuery = (query: URLSearchParams) => {
    navigate({
      pathname,
      search: `?${query.toString()}`,
    });
  };

  return [params, replaceQuery, setQuery];
};

export default useQuery;
