import { useEffect, useState } from 'react';
import { RequestState, RequestStatus } from '../../types/RequestContent';
import ErrorDisplay from './ErrorDisplay';
import LoadingPlaceholder from './LoadingPlaceholder';
import SuccessPlaceholder from './SuccessPlaceholder';

// The below is a component that helps handle requests by showing different elements based on the requests state.
// This includes loading, error, and success states.

/* -------------------------------------------------------------------------- */

// Objects that hold func and amount of times it can be called
// eslint-disable-next-line @typescript-eslint/ban-types
interface stateEffect<T extends Function> {
  effect: T;
  callCount?: number;
}

// ____Element parameters are component function that will be returned when the specified state is active
// Success element will be passed the data from the request.
// Error element will be passed the error string from the request and the retryFunc.
// Loading element will be passed nothing.

// ____Effect are an object with side effect function to call when the specified state is active
// and a call count to determine the max amount of times the effect can be called.
interface LoadErrorHandleProps<T> {
  requestInfo: RequestState<T>;
  successElement?: (data: { data: T }) => JSX.Element;
  successEffect?: stateEffect<(data: { data: T }) => void>;
  errorElement?: (errorString: { errorString: string; retryFunc?: () => void }) => JSX.Element;
  errorEffect?: stateEffect<(errorString: { errorString: string }) => void>;
  loadingElement?: () => JSX.Element;
  loadingEffect?: stateEffect<() => void>;
  // Will be passed to the error element if there is one.
  retryFunc?: () => void;
  // Determines if the component will return a placeholder element when there is no element passed for the state.
  placeHolders?: boolean;
}

const LoadErrorHandle = <T,>(handlingData: LoadErrorHandleProps<T>): JSX.Element => {
  // Sets up state for how many times to call an effect
  // If undefined call infinitely
  const [successCalls, setSuccessCalls] = useState(handlingData.successEffect?.callCount);
  const [loadingCalls, setLoadingCalls] = useState(handlingData.loadingEffect?.callCount);
  const [errorCalls, setErrorCalls] = useState(handlingData.errorEffect?.callCount);

  useEffect(() => {
    switch (handlingData.requestInfo.requestStatus) {
      case RequestStatus.Loading:
        // Checks if there is a loading side effect if so checks if it should be called
        if (handlingData.loadingEffect !== undefined) {
          if (loadingCalls === undefined) {
            handlingData.loadingEffect.effect();
          } else if (loadingCalls > 0) {
            handlingData.loadingEffect.effect();
            setLoadingCalls((callsLeft) => (callsLeft ? callsLeft - 1 : undefined));
          }
        }

        break;

      case RequestStatus.Error:
        // Checks if there is a error side effect if so checks if it should be called
        if (handlingData.errorEffect !== undefined) {
          if (errorCalls === undefined) {
            handlingData.errorEffect.effect({ errorString: handlingData.requestInfo.requestError });
          } else if (errorCalls > 0) {
            handlingData.errorEffect.effect({ errorString: handlingData.requestInfo.requestError });
            setErrorCalls((callsLeft) => (callsLeft ? callsLeft - 1 : undefined));
          }
        }

        break;

      case RequestStatus.Success:
        // Checks if there is a success side effect if so checks if it should be called
        if (handlingData.successEffect !== undefined) {
          if (successCalls === undefined) {
            handlingData.successEffect.effect({ data: handlingData.requestInfo.requestedData });
          } else if (successCalls > 0) {
            handlingData.successEffect.effect({ data: handlingData.requestInfo.requestedData });
            setSuccessCalls((callsLeft) => (callsLeft ? callsLeft - 1 : undefined));
          }
        }

        break;
    }
  }, [handlingData.requestInfo, handlingData.requestInfo.requestStatus]);

  // Helps handle requests by showing different elements based on the requests state
  switch (handlingData.requestInfo.requestStatus) {
    case RequestStatus.Loading:
      // Checks if there is a element passed to display while loading
      // if now will return placeholder or nothing
      if (handlingData.loadingElement !== undefined) {
        const LoadingElement = handlingData.loadingElement;
        return <LoadingElement />;
      }

      if (handlingData.placeHolders === undefined || handlingData.placeHolders === true) {
        return <LoadingPlaceholder />;
      }

      return <></>;

    case RequestStatus.Error:
      // Checks if there is a element passed to display when there is an error
      // if now will return placeholder or nothing
      if (handlingData.errorElement !== undefined) {
        const ErrorElement = handlingData.errorElement;
        return (
          <ErrorElement
            errorString={handlingData.requestInfo.requestError}
            retryFunc={handlingData.retryFunc}
          />
        );
      }

      if (handlingData.placeHolders === undefined || handlingData.placeHolders === true) {
        return (
          <ErrorDisplay
            errorString={handlingData.requestInfo.requestError}
            retryFunc={handlingData.retryFunc}
          />
        );
      }

      return <></>;

    case RequestStatus.Success:
      // Checks if there is a element passed to display when the request is successful
      // if now will return placeholder or nothing
      if (handlingData.successElement !== undefined) {
        const SuccessElement = handlingData.successElement;
        return <SuccessElement data={handlingData.requestInfo.requestedData} />;
      }

      if (handlingData.placeHolders === undefined || handlingData.placeHolders === true) {
        return <SuccessPlaceholder />;
      }

      return <></>;
  }
};

export default LoadErrorHandle;
