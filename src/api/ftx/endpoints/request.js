import got from 'got';

import {
  ApiError,
  HttpError,
  RateLimitError,
} from '../../../common/errors/index.js';

function composeOptions(headers, requestBody) {
  return {
    headers,
    ...(requestBody != null && { json: requestBody }),
  };
}

function parseErrorBody(error) {
  if (error?.response?.body == null) {
    return null;
  }

  return JSON.parse(error.response.body);
}

function getErrorMessage(error) {
  const parsedResponseBody = parseErrorBody(error);

  if (parsedResponseBody == null) {
    return null;
  }

  return parsedResponseBody.error;
}

function handleError(error) {
  const message = getErrorMessage(error);

  if (message == null) {
    // Unexpected error unhandled by API.
    throw new HttpError(error);
  }

  if (error?.response?.statusCode === 429) {
    // Rate limit error handled by API.
    throw new RateLimitError(message);
  }

  // Generic error handled by API.
  throw new ApiError(message);
}

async function request({ url, method = 'get', headers, requestBody }) {
  const options = composeOptions(headers, requestBody);

  try {
    const response = await got[method](url, options).json();

    return response.result;
  } catch (error) {
    return handleError(error);
  }
}

export { request };
