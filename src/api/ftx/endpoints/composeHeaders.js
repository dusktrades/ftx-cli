import crypto from 'crypto';

import { CONFIG } from '../../../config/index.js';

const USER_AGENT = `${CONFIG.PACKAGE.name}@${CONFIG.PACKAGE.version}`;

const COMMON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': USER_AGENT,
  'X-Requested-With': 'XMLHttpRequest',
};

function encodeRequestBody(requestBody) {
  if (requestBody == null) {
    return '';
  }

  return JSON.stringify(requestBody);
}

function composePayload(timestamp, endpoint, method = 'get', requestBody) {
  const normalisedMethod = method.toUpperCase();
  const path = `/api/${endpoint}`;
  const encodedRequestBody = encodeRequestBody(requestBody);

  return `${timestamp}${normalisedMethod}${path}${encodedRequestBody}`;
}

function composeSignature(
  timestamp,
  endpoint,
  method,
  credentials,
  requestBody
) {
  const payload = composePayload(timestamp, endpoint, method, requestBody);

  return crypto
    .createHmac('sha256', credentials.apiSecret)
    .update(payload)
    .digest('hex');
}

function composeAuthenticatedHeaders({
  endpoint,
  method,
  credentials,
  requestBody,
}) {
  // We can't authenticate without API key and secret.
  if (credentials.apiKey == null || credentials.apiSecret == null) {
    return COMMON_HEADERS;
  }

  const timestamp = Date.now();

  const signature = composeSignature(
    timestamp,
    endpoint,
    method,
    credentials,
    requestBody
  );

  return {
    ...COMMON_HEADERS,
    'FTX-KEY': credentials.apiKey,
    'FTX-TS': timestamp,
    'FTX-SIGN': signature,
    ...(credentials.subaccount != null && {
      'FTX-SUBACCOUNT': encodeURI(credentials.subaccount),
    }),
  };
}

function composeHeaders({ endpoint, method, credentials, requestBody } = {}) {
  // Credentials are passed for endpoints which require authentication headers.
  if (credentials == null) {
    return COMMON_HEADERS;
  }

  return composeAuthenticatedHeaders({
    endpoint,
    method,
    credentials,
    requestBody,
  });
}

export { composeHeaders };
