import BigNumber from 'bignumber.js';

import { ApiError } from '../../../../../../common/errors/index.js';
import { orders } from '../../../../endpoints/index.js';

function processPrice(data) {
  // Exchange decides price for market orders.
  if (data.type === 'market') {
    return null;
  }

  /**
   * Case not handled properly by API: limit order would be treated as market
   * order with infinite price (even as Post-Only).
   */
  if (data.price == null) {
    throw new ApiError('Limit orders must specify price');
  }

  return data.price.toNumber();
}

function processSize(data) {
  // TODO: Parse input to BigNumber instead of in controller.
  return new BigNumber(data.size).dividedBy(data.orderCount).toNumber();
}

function processPostOnly(data) {
  // Post-Only mode only affects regular limit orders.
  if (data.type === 'limit') {
    return data.enablePostOnly;
  }

  return null;
}

function processIoc(data) {
  // IOC mode only affects regular limit orders.
  if (data.type === 'limit') {
    return data.enableIoc;
  }

  return null;
}

function composeRequestBody(data) {
  /**
   * Case not handled properly by API: unclear why an error isn't returned,
   * since execution should be impossible.
   */
  if (data.enablePostOnly && data.enableIoc) {
    throw new ApiError('Orders cannot be Post-Only and IOC');
  }

  return {
    market: data.market,
    side: data.side,
    type: data.type,
    price: processPrice(data),
    size: processSize(data),
    postOnly: processPostOnly(data),
    ioc: processIoc(data),
    reduceOnly: data.enableReduceOnly,
  };
}

function composeRegularRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return () => orders.placeOrder({ exchange, credentials, requestBody });
}

export { composeRegularRequest };
