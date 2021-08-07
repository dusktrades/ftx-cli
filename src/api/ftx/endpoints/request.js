import got from 'got';

import {
  ApiError,
  HttpError,
  RateLimitError,
} from '../../../common/errors/index.js';

import { CONFIG } from '../../../config/index.js';
import { composeEndpoint } from './composeEndpoint.js';
import { composeHeaders } from './composeHeaders.js';
import { composeUrl } from './composeUrl.js';

/**
 * Tag POST requests with our External Referral Program name; required for
 * order endpoints.
 */
function composeRequestBody(requestBody) {
  return {
    ...requestBody,
    externalReferralProgram: CONFIG.EXTERNAL_REFERRAL_PROGRAM_NAME,
  };
}

function composePostRequestOptions(options) {
  const requestBody = composeRequestBody(options.requestBody);

  return {
    headers: composeHeaders({ ...options, requestBody }),
    json: requestBody,
  };
}

function composeRequestOptions(options) {
  if (options.method === 'post') {
    return composePostRequestOptions(options);
  }

  return { headers: composeHeaders(options) };
}

/**
 * Errors handled by the FTX API will include a response body with an `error`
 * key (error message).
 */
function parseErrorMessage(error) {
  return JSON.parse(error?.response?.body)?.error;
}

function handleError(error) {
  const message = parseErrorMessage(error);

  if (message == null) {
    throw new HttpError(error);
  }

  throw error.response.statusCode === 429
    ? new RateLimitError(message)
    : new ApiError(message);
}

async function request(options) {
  const endpoint = composeEndpoint(
    options.rawEndpoint,
    options.queryParameters
  );

  const url = composeUrl(options.exchange, endpoint);
  const requestOptions = composeRequestOptions({ ...options, endpoint });

  try {
    const response = await got[options.method](url, requestOptions).json();

    return response.result;
  } catch (error) {
    return handleError(error);
  }
}

export { request };
