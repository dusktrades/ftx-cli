import BigNumber from 'bignumber.js';

import { orders } from '../../endpoints/index.js';
import { queues } from '../../queues/index.js';

function processPrice(data) {
  // Exchange decides price for market orders.
  if (data.type === 'market') {
    return null;
  }

  return data.price.toNumber();
}

function processSize(data) {
  // TODO: Parse input to BigNumber instead of in controller.
  return new BigNumber(data.size).dividedBy(data.orderCount).toNumber();
}

function processPostOnly(data) {
  // Market orders can't be post-only.
  if (data.type === 'market') {
    return false;
  }

  return data.enablePostOnly;
}

function composeRequestBody(data) {
  return {
    market: data.market,
    side: data.side,
    type: data.type,
    price: processPrice(data),
    size: processSize(data),
    postOnly: processPostOnly(data),
  };
}

function composeRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return orders.placeOrder({ exchange, credentials, requestBody });
}

function composeSimpleRequests(exchange, credentials, data) {
  const composeSimpleRequest = () =>
    composeRequest(exchange, credentials, data);

  return Array.from({ length: data.orderCount }, () => composeSimpleRequest);
}

function calculateStep(data) {
  const difference = data.price.to.minus(data.price.from);
  const additionalOrderCount = data.orderCount.minus(new BigNumber(1));

  if (additionalOrderCount.isZero()) {
    return new BigNumber(0);
  }

  return difference.dividedBy(additionalOrderCount);
}

/**
 * Calculate price based on order side so we can prioritise placing orders
 * closer to the spread.
 */
function calculatePrice(data, offset) {
  // Sell orders: prioritise low to high.
  if (data.side === 'sell') {
    return data.price.from.plus(offset);
  }

  // Buy orders: prioritise high to low.
  return data.price.to.minus(offset);
}

function composeScaledRequests(exchange, credentials, data) {
  const step = calculateStep(data);

  return Array.from({ length: data.orderCount }, (_, orderIndex) => {
    const offset = step.multipliedBy(orderIndex);

    const processedData = {
      ...data,
      price: calculatePrice(data, offset),
    };

    return () => composeRequest(exchange, credentials, processedData);
  });
}

function composeRequests(exchange, credentials, data) {
  if (data.price?.from == null) {
    return composeSimpleRequests(exchange, credentials, data);
  }

  return composeScaledRequests(exchange, credentials, data);
}

async function place({ exchange, credentials, data }) {
  const requests = composeRequests(exchange, credentials, data);

  return queues.orders.addAll(requests);
}

export { place };
