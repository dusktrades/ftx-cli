import {
  ApiError,
  EmptyResultsError,
  ExchangeUnavailableError,
  HttpError,
  Logger,
  RateLimitError,
} from '../src/common/index.js';

function isHandled(error) {
  const handledErrors = [
    ApiError,
    EmptyResultsError,
    ExchangeUnavailableError,
    HttpError,
    RateLimitError,
  ];

  return handledErrors.some((handledError) => error instanceof handledError);
}

function handleError(error) {
  /**
   * A handled error occurred. We should have an error message so user can learn
   * how to solve the issue.
   */
  if (isHandled(error)) {
    Logger.error(error.message);

    return;
  }

  // Houston, we have a problem.
  Logger.error(`An unhandled error occurred:\n\n${error.stack}`);
}

export { handleError };
