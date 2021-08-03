import {
  ApiError,
  EmptyResultsError,
  HttpError,
  RateLimitError,
} from '../src/common/errors/index.js';

import { Logger } from '../src/common/logger/index.js';

const HANDLED_ERRORS = [ApiError, EmptyResultsError, HttpError, RateLimitError];

function isErrorHandled(error) {
  return HANDLED_ERRORS.some((handledError) => error instanceof handledError);
}

function handleError(error, enableColours) {
  /**
   * A handled error occurred. We should have an error message so user can learn
   * how to solve the issue.
   */
  if (isErrorHandled(error)) {
    Logger.error(error.message, { enableColours });

    return;
  }

  // Houston, we have a problem.
  Logger.error(`An unhandled error occurred:\n\n${error.stack}`, {
    enableColours,
  });
}

export { handleError };
