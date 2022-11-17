import React from "react";
import { RequestState, RequestStatus } from "../types/RequestContent";
import ErrorDisplay from "./ErrorDisplay";
import LoadingPlaceholder from "./LoadingPlaceholder";

/* -------------------------------------------------------------------------- */

interface LoadErrorHandleProps<T> {
  requestInfo: RequestState<T>
  // Function to call on success of the request should return element to display
  successCallback: (data: T) => JSX.Element, 
}

const LoadErrorHandle = <T, >({successCallback, requestInfo}: LoadErrorHandleProps<T>): JSX.Element => {
  // Helps handle requestest by showing different elements based on the requests state
  switch (requestInfo.requestStatus) {
    case RequestStatus.Loading:
      return <LoadingPlaceholder />;
    case RequestStatus.Error:
      return <ErrorDisplay errorString={requestInfo.requestError} />;
    case RequestStatus.Success:
      return successCallback(requestInfo.contentList);
  };
}

export default LoadErrorHandle;