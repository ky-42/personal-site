import type { ReactElement } from "react";
import { useEffect, useEffectEvent, useRef } from "react";
import { type RequestState, RequestStatus } from "../../types/RequestContent";
import ErrorDisplay from "./ErrorDisplay";
import LoadingPlaceholder from "./LoadingPlaceholder";
import SuccessPlaceholder from "./SuccessPlaceholder";

// The below is a component that helps handle requests by showing different elements based on the requests state.
// This includes loading, error, and success states.

/* -------------------------------------------------------------------------- */

// Objects that hold func and amount of times it can be called
interface stateEffect<Arg = void> {
  effect: (arg: Arg) => void;
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
  successElement?: (data: { data: T }) => ReactElement | null;
  successEffect?: stateEffect<{ data: T }>;
  errorElement?: (errorString: {
    errorString: string;
    retryFunc?: () => void;
  }) => ReactElement;
  errorEffect?: stateEffect<{ errorString: string }>;
  loadingElement?: () => ReactElement | null;
  loadingEffect?: stateEffect;
  // Will be passed to the error element if there is one.
  retryFunc?: () => void;
  // Determines if the component will return a placeholder element when there is no element passed for the state.
  placeHolders?: boolean;
}

const LoadErrorHandle = <T,>(
  handlingData: LoadErrorHandleProps<T>,
): ReactElement | null => {
  // Sets up state for how many times to call an effect
  // If undefined call infinitely
  const callsLeft = useRef({
    successCalls: handlingData.successEffect?.callCount,
    loadingCalls: handlingData.loadingEffect?.callCount,
    errorCalls: handlingData.errorEffect?.callCount,
  });

  const runStateEffects = useEffectEvent((requestInfo: RequestState<T>) => {
    const { loadingEffect, errorEffect, successEffect } = handlingData;
    const calls = callsLeft.current;

    switch (requestInfo.requestStatus) {
      case RequestStatus.Loading:
        // Checks if there is a loading side effect if so checks if it should be called
        if (
          loadingEffect &&
          (calls.loadingCalls === undefined || calls.loadingCalls > 0)
        ) {
          loadingEffect.effect();
          if (calls.loadingCalls !== undefined) calls.loadingCalls -= 1;
        }
        break;

      case RequestStatus.Error:
        // Checks if there is a error side effect if so checks if it should be called
        if (
          errorEffect &&
          (calls.errorCalls === undefined || calls.errorCalls > 0)
        ) {
          errorEffect.effect({
            errorString: requestInfo.requestError,
          });
          if (calls.errorCalls !== undefined) calls.errorCalls -= 1;
        }

        break;

      case RequestStatus.Success:
        // Checks if there is a success side effect if so checks if it should be called
        if (
          successEffect &&
          (calls.successCalls === undefined || calls.successCalls > 0)
        ) {
          successEffect.effect({
            data: requestInfo.requestedData,
          });
          if (calls.successCalls !== undefined) calls.successCalls -= 1;
        }

        break;
    }
  });

  useEffect(() => {
    runStateEffects(handlingData.requestInfo);
  }, [handlingData.requestInfo]);

  // Helps handle requests by showing different elements based on the requests state
  switch (handlingData.requestInfo.requestStatus) {
    case RequestStatus.Loading:
      // Checks if there is a element passed to display while loading
      // if now will return placeholder or nothing
      if (handlingData.loadingElement !== undefined) {
        const LoadingElement = handlingData.loadingElement;
        return <LoadingElement />;
      }

      if (
        handlingData.placeHolders === undefined ||
        handlingData.placeHolders === true
      ) {
        return <LoadingPlaceholder />;
      }

      return null;

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

      if (
        handlingData.placeHolders === undefined ||
        handlingData.placeHolders === true
      ) {
        return (
          <ErrorDisplay
            errorString={handlingData.requestInfo.requestError}
            retryFunc={handlingData.retryFunc}
          />
        );
      }

      return null;

    case RequestStatus.Success:
      // Checks if there is a element passed to display when the request is successful
      // if now will return placeholder or nothing
      if (handlingData.successElement !== undefined) {
        const SuccessElement = handlingData.successElement;
        return <SuccessElement data={handlingData.requestInfo.requestedData} />;
      }

      if (
        handlingData.placeHolders === undefined ||
        handlingData.placeHolders === true
      ) {
        return <SuccessPlaceholder />;
      }

      return null;
  }
};

export default LoadErrorHandle;
