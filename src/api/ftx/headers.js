import crypto from 'crypto';

import { CONFIG } from '../../config/index.js';

const USER_AGENT = `${CONFIG.PACKAGE.name}@${CONFIG.PACKAGE.version}`;

const COMMON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': USER_AGENT,
  'X-Requested-With': 'XMLHttpRequest',
};

function encodeRequestBody(requestBody) {
  return requestBody == null ? '' : JSON.stringify(requestBody);
}

function composePayload(timestamp, method, endpoint, requestBody) {
  const normalisedMethod = method.toUpperCase();
  const path = `/api/${endpoint}`;
  const encodedRequestBody = encodeRequestBody(requestBody);

  return `${timestamp}${normalisedMethod}${path}${encodedRequestBody}`;
}

function composeSignature(timestamp, method, endpoint, requestBody, apiSecret) {
  const payload = composePayload(timestamp, method, endpoint, requestBody);

  return crypto.createHmac('sha256', apiSecret).update(payload).digest('hex');
}

function composeAuthenticationHeaders({
  method,
  endpoint,
  requestBody,
  options,
}) {
  // We can't authenticate without API key and secret.
  if (options.global.key == null || options.global.secret == null) {
    return {};
  }

  const timestamp = Date.now();

  const signature = composeSignature(
    timestamp,
    method,
    endpoint,
    requestBody,
    options.global.secret
  );

  return {
    'FTX-KEY': options.global.key,
    'FTX-TS': timestamp,
    'FTX-SIGN': signature,
    ...(options.global.subaccount != null && {
      'FTX-SUBACCOUNT': encodeURI(options.global.subaccount),
    }),
  };
}

export { COMMON_HEADERS, composeAuthenticationHeaders };
