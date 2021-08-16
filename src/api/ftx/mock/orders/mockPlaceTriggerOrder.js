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
  return ['stop', 'trailingStop', 'takeProfit'].includes(type);
}

function isValidRetryUntilFilled(retryUntilFilled) {
  return retryUntilFilled == null || typeof retryUntilFilled === 'boolean';
}

function isValidOrderPrice(orderPrice) {
  // Order price is optional.
  if (orderPrice == null) {
    return true;
  }

  const safeOrderPrice = new BigNumber(orderPrice);

  // Provided order price should be a number greater than zero.
  return !safeOrderPrice.isNaN() && safeOrderPrice.isPositive();
}

function requiresTriggerPrice(type) {
  return ['stop', 'takeProfit'].includes(type);
}

function isValidTriggerPrice({ type, triggerPrice }) {
  // If order doesn't require trigger price then it shouldn't be provided.
  if (!requiresTriggerPrice(type)) {
    return triggerPrice == null;
  }

  const safeTriggerPrice = new BigNumber(triggerPrice);

  // Trigger price is required and should be a number greater than zero.
  return !safeTriggerPrice.isNaN() && safeTriggerPrice.isPositive();
}

function requiresTrailValue(type) {
  return type === 'trailingStop';
}

function isValidTrailValue({ type, trailValue }) {
  // If order doesn't require trail value then it shouldn't be provided.
  if (!requiresTrailValue(type)) {
    return trailValue == null;
  }

  const safeTrailValue = new BigNumber(trailValue);

  // Trail value is required and should be a non-zero number.
  return !safeTrailValue.isNaN() && !safeTrailValue.isZero();
}

function areCombinationsValid({ orderPrice, retryUntilFilled }) {
  /**
   * Order price (limit orders) and Retry-Until-Filled mode (market orders)
   * conflict and shouldn't be provided together.
   */
  if (orderPrice != null && retryUntilFilled != null) {
    return false;
  }

  return true;
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

  if (!isValidReduceOnly(requestBody.reduceOnly)) {
    return false;
  }

  if (!isValidRetryUntilFilled(requestBody.retryUntilFilled)) {
    return false;
  }

  if (!isValidOrderPrice(requestBody.orderPrice)) {
    return false;
  }

  if (!isValidTriggerPrice(requestBody)) {
    return false;
  }

  if (!isValidTrailValue(requestBody)) {
    return false;
  }

  if (!isValidExternalReferralProgram(requestBody.externalReferralProgram)) {
    return false;
  }

  if (!areCombinationsValid(requestBody)) {
    return false;
  }

  return true;
}

function mockPlaceTriggerOrder() {
  const ENDPOINT = '/api/conditional_orders';

  MOCK_HOSTNAME.post(ENDPOINT, MARKET_NOT_FOUND_ERROR.REQUEST)
    .reply(500, MARKET_NOT_FOUND_ERROR.RESPONSE)
    .post(ENDPOINT, isSuccessfulRequest)
    .reply(200, { success: true, result: {} });
}

export { mockPlaceTriggerOrder };
