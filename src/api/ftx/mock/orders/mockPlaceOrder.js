import BigNumber from 'bignumber.js';

import { MOCK_HOSTNAME } from '../mockHostname.js';

import {
  MARKET_NOT_FOUND_ERROR,
  isValidExternalReferralProgram,
  isValidMarket,
  isValidReduceOnly,
  isValidSide,
  isValidSize,
} from './common/index.js';

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

  if (!isValidExternalReferralProgram(requestBody.externalReferralProgram)) {
    return false;
  }

  // TODO: Add checks for `ioc` and `postOnly`.
  // TODO: Implement `rejectOnPriceBand`.

  return true;
}

function mockPlaceOrder() {
  const ENDPOINT = '/api/orders';

  MOCK_HOSTNAME.post(ENDPOINT, MARKET_NOT_FOUND_ERROR.REQUEST)
    .reply(500, MARKET_NOT_FOUND_ERROR.RESPONSE)
    .post(ENDPOINT, isSuccessfulRequest)
    .reply(200, { success: true, result: {} });
}

export { mockPlaceOrder };
