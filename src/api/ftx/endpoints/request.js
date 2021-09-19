import { parseISO } from 'date-fns';
import got from 'got';

import {
  ApiError,
  ExchangeUnavailableError,
  HttpError,
  RateLimitError,
} from '../../../common/index.js';

import { CONFIG } from '../../../config/index.js';
import { MAX_32_BIT_INTEGER } from '../../../util/index.js';
import { composeEndpoint } from './composeEndpoint.js';
import { composeHeaders } from './composeHeaders.js';
import { composeUrl } from './composeUrl.js';
import { time } from './time/index.js';

let serverTimeOffsetMilliseconds = 0;

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
    headers: composeHeaders({
      ...options,
      requestBody,
      serverTimeOffsetMilliseconds,
    }),
    ...(requestBody != null && { json: requestBody }),
  };
}

/**
 * Errors handled by the FTX API will include a response body with an `error`
 * key (error message).
 */
function parseErrorMessage(error) {
  const responseBody = error?.response?.body;

  return responseBody == null ? null : JSON.parse(responseBody).error;
}

function isRateLimitError(statusCode) {
  return statusCode === 429;
}

function isExchangeUnavailableError(message) {
  const broadMatchers = ['unexpected error', 'retry request', 'try again'];

  return broadMatchers.some((matcher) =>
    message.toLowerCase().includes(matcher)
  );
}

/**
 * TODO: Refactor so an 'errors' file is the source of truth for errors and
 * their matchers.
 */
function handleError(error) {
  const message = parseErrorMessage(error);

  if (message == null) {
    throw new HttpError(error);
  }

  if (isRateLimitError(error.response.statusCode)) {
    throw new RateLimitError(message);
  }

  if (isExchangeUnavailableError(message)) {
    throw new ExchangeUnavailableError(message);
  }

  throw new ApiError(message);
}

async function request(options) {
  const endpoint = composeEndpoint(
    options.rawEndpoint,
    options.queryParameters
  );

  const url = composeUrl({ ...options, endpoint });
  const requestOptions = composeRequestOptions({ ...options, endpoint });

  try {
    const response = await got[options.method](url, requestOptions).json();

    return response.result;
  } catch (error) {
    return handleError(error);
  }
}

function calculateServerTimeOffset(server, start, end) {
  const offset = server - end;
  const approximateRoundTripTime = end - start;
  const approximateRequestTime = approximateRoundTripTime / 2;

  return Math.round(offset + approximateRequestTime);
}

async function setServerTimeOffset(options) {
  const startMilliseconds = Date.now();
  const serverTime = await request(time.getServerTime(options));
  const endMilliseconds = Date.now();
  const serverMilliseconds = parseISO(serverTime).getTime();

  serverTimeOffsetMilliseconds = calculateServerTimeOffset(
    serverMilliseconds,
    startMilliseconds,
    endMilliseconds
  );
}

export { request, setServerTimeOffset };
