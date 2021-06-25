import got from 'got';

import { ApiError, HttpError } from '../../../common/errors/index.js';

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

async function request({ url, method = 'get', headers, requestBody }) {
  try {
    const options = composeOptions(headers, requestBody);
    const response = await got[method](url, options).json();

    return response.result;
  } catch (error) {
    const message = getErrorMessage(error);

    if (message == null) {
      // Error is unexpected and not handled by API.
      throw new HttpError(error);
    }

    // Error is handled by API.
    throw new ApiError(message);
  }
}

export { request };
