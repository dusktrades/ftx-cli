import BigNumber from 'bignumber.js';
import nock from 'nock';

import { COMMON_REQUEST_HEADERS, HOSTNAME } from '../../helpers/index.js';

import {
  MARKET_NOT_FOUND_ERROR,
  isValidExternalReferralProgram,
  isValidMarket,
  isValidReduceOnly,
  isValidSide,
  isValidSize,
} from './helpers/index.js';

function isValidType(type) {
  return ['market', 'limit'].includes(type);
}

function requiresPrice(type) {
  return type === 'limit';
}

function isValidPrice({ type, price }) {
  // If order doesn't require price then it shouldn't be provided.
  if (!requiresPrice(type)) {
    return price == null;
  }

  const safePrice = new BigNumber(price);

  // Provided price should be a number greater than zero.
  return !safePrice.isNaN() && safePrice.isPositive();
}

function requiresIoc(type) {
  return type === 'limit';
}

function isValidIoc({ type, ioc }) {
  // If order doesn't require IOC mode then it shouldn't be provided.
  if (!requiresIoc(type)) {
    return ioc == null;
  }

  return typeof ioc === 'boolean';
}

function requiresPostOnly(type) {
  return type === 'limit';
}

function isValidPostOnly({ type, postOnly }) {
  // If order doesn't require Post-Only mode then it shouldn't be provided.
  if (!requiresPostOnly(type)) {
    return postOnly == null;
  }

  return typeof postOnly === 'boolean';
}

function isSuccessfulRequest(requestBody) {
  if (!isValidMarket(requestBody.market)) {
    return false;
  }

  if (!isValidSide(requestBody.side)) {
    return false;
  }

  if (!isValidType(requestBody.type)) {
    return false;
  }

  if (!isValidSize(requestBody.size)) {
    return false;
  }

  if (!isValidPrice(requestBody)) {
    return false;
  }

  if (!isValidReduceOnly(requestBody.reduceOnly)) {
    return false;
  }

  if (!isValidIoc(requestBody)) {
    return false;
  }

  if (!isValidPostOnly(requestBody)) {
    return false;
  }

  // TODO: Implement `rejectOnPriceBand`.

  if (!isValidExternalReferralProgram(requestBody.externalReferralProgram)) {
    return false;
  }

  return true;
}

function mockPlaceOrder() {
  const endpoint = '/api/orders';

  nock(HOSTNAME, {
    reqheaders: {
      ...COMMON_REQUEST_HEADERS,
      'ftx-key': 'key',
    },
  })
    .persist()
    .post(endpoint, MARKET_NOT_FOUND_ERROR.request)
    .reply(500, MARKET_NOT_FOUND_ERROR.response)
    .post(endpoint, isSuccessfulRequest)
    .reply(200, { success: true, result: {} });
}

export { mockPlaceOrder };
