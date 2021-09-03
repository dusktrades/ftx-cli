import crypto from 'crypto';

import { CONFIG } from '../../../config/index.js';

const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': `${CONFIG.PACKAGE.name}@${CONFIG.PACKAGE.version}`,
  'X-Requested-With': 'XMLHttpRequest',
};

function canAuthenticate(credentials) {
  return credentials?.apiKey != null && credentials?.apiSecret != null;
}

function composePrefix(exchange) {
  return exchange === 'ftx-us' ? 'FTXUS' : 'FTX';
}

function composePath(endpoint) {
  return `/api/${endpoint}`;
}

function encodeRequestBody(requestBody) {
  return requestBody == null ? '' : JSON.stringify(requestBody);
}

function calculateTimestamp(serverTimeOffsetMilliseconds) {
  return Date.now() + serverTimeOffsetMilliseconds;
}

function composePayload(
  endpoint,
  method,
  requestBody,
  serverTimeOffsetMilliseconds
) {
  const normalisedMethod = method.toUpperCase();
  const path = composePath(endpoint);
  const encodedRequestBody = encodeRequestBody(requestBody);
  const timestamp = calculateTimestamp(serverTimeOffsetMilliseconds);

  return {
    timestamp,
    payload: `${timestamp}${normalisedMethod}${path}${encodedRequestBody}`,
  };
}

function composeSignature(
  endpoint,
  method,
  apiSecret,
  requestBody,
  serverTimeOffsetMilliseconds
) {
  const { timestamp, payload } = composePayload(
    endpoint,
    method,
    requestBody,
    serverTimeOffsetMilliseconds
  );

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(payload)
    .digest('hex');

  return { timestamp, signature };
}

function hasSubaccount(subaccount) {
  return subaccount !== 'main';
}

function composeAuthenticatedHeaders({
  exchange,
  endpoint,
  method,
  credentials,
  requestBody,
  serverTimeOffsetMilliseconds,
}) {
  const prefix = composePrefix(exchange);

  const { timestamp, signature } = composeSignature(
    endpoint,
    method,
    credentials.apiSecret,
    requestBody,
    serverTimeOffsetMilliseconds
  );

  return {
    ...commonHeaders,
    [`${prefix}-KEY`]: credentials.apiKey,
    [`${prefix}-TS`]: timestamp,
    [`${prefix}-SIGN`]: signature,
    ...(hasSubaccount(credentials.subaccount) && {
      [`${prefix}-SUBACCOUNT`]: encodeURI(credentials.subaccount),
    }),
  };
}

function composeHeaders(options) {
  /**
   * We can't authenticate if we are missing API key or secret, so we fail-fast
   * and send the common, unauthenticated headers. This may be:
   *
   * - Intentional: the endpoint doesn't require authentication
   * - Unintentional: the endpoint requires authentication but the user forgot
   */
  return !canAuthenticate(options.credentials)
    ? commonHeaders
    : composeAuthenticatedHeaders(options);
}

export { composeHeaders };
