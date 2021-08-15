import got from 'got';

import { ApiError, HttpError, RateLimitError } from '../../../common/index.js';
import { CONFIG } from '../../../config/index.js';
import { MAX_32_BIT_INTEGER } from '../../../util/index.js';
import { composeEndpoint } from './composeEndpoint.js';
import { composeHeaders } from './composeHeaders.js';
import { composeUrl } from './composeUrl.js';

/**
 * We should tag the request with our External Referral Program name if the
 * endpoint requires/accepts it and the exchange is set to FTX. FTX US has a
 * separate External Referral Program system which we are not currently using.
 */
function shouldTagRequest(enableExternalReferralProgram, exchange) {
  return enableExternalReferralProgram && exchange === 'ftx';
}

function composeRequestBody({
  requestBody,
  enableExternalReferralProgram,
  exchange,
}) {
  if (requestBody == null) {
    return null;
  }

  return {
    ...requestBody,
    ...(shouldTagRequest(enableExternalReferralProgram, exchange) && {
      externalReferralProgram: CONFIG.EXTERNAL_REFERRAL_PROGRAM_NAME,
    }),
  };
}

function composeRequestOptions(options) {
  const requestBody = composeRequestBody(options);

  return {
    timeout: { request: MAX_32_BIT_INTEGER },
    retry: 0,
    headers: composeHeaders({ ...options, requestBody }),
    ...(requestBody != null && { json: requestBody }),
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
