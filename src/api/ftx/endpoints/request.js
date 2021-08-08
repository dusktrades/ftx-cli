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

const COMMON_REQUEST_OPTIONS = {
  timeout: { request: 2_147_483_647 },
};

/**
 * Tag POST requests with our External Referral Program name; required for
 * order endpoints. FTX US has a separate External Referral Program system,
 * which we are not currently using.
 */
function composeRequestBody({ exchange, requestBody }) {
  return {
    ...requestBody,
    ...(exchange === 'ftx' && {
      externalReferralProgram: CONFIG.EXTERNAL_REFERRAL_PROGRAM_NAME,
    }),
  };
}

function composePostRequestOptions(options) {
  const requestBody = composeRequestBody(options);

  return {
    ...COMMON_REQUEST_OPTIONS,
    headers: composeHeaders({ ...options, requestBody }),
    json: requestBody,
  };
}

function composeRequestOptions(options) {
  if (options.method === 'post') {
    return composePostRequestOptions(options);
  }

  return {
    ...COMMON_REQUEST_OPTIONS,
    headers: composeHeaders(options),
  };
}

/**
 * Errors handled by the FTX API will include a response body with an `error`
 * key (error message).
 */
function parseErrorMessage(error) {
  const responseBody = error?.response?.body;

  if (responseBody == null) {
    return null;
  }

  return JSON.parse(responseBody).error;
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
