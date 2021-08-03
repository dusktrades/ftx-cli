import BigNumber from 'bignumber.js';

import { queueOrderRequest } from '../queueOrderRequest.js';
import { settleOrderRequests } from '../settleOrderRequests.js';
import { composeRequest } from './composeRequest.js';

async function composeSimpleRequests(exchange, credentials, data) {
  const requests = [];
  const request = composeRequest(exchange, credentials, data);

  for (
    let orderIndex = 0;
    orderIndex < data.orderCount.toNumber();
    orderIndex += 1
  ) {
    requests.push(queueOrderRequest(request));
  }

  await settleOrderRequests(requests);
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
 * outwards from the spread.
 */
function calculatePrice(data, offset) {
  // Sell orders: prioritise low to high.
  if (data.side === 'sell') {
    return data.price.from.plus(offset);
  }

  // Buy orders: prioritise high to low.
  return data.price.to.minus(offset);
}

function composeScaledRequest(exchange, credentials, data, step, orderIndex) {
  const offset = step.multipliedBy(new BigNumber(orderIndex));

  const processedData = {
    ...data,
    price: calculatePrice(data, offset),
  };

  return composeRequest(exchange, credentials, processedData);
}

async function composeScaledRequests(exchange, credentials, data) {
  const requests = [];
  const step = calculateStep(data);

  for (
    let orderIndex = 0;
    orderIndex < data.orderCount.toNumber();
    orderIndex += 1
  ) {
    const request = composeScaledRequest(
      exchange,
      credentials,
      data,
      step,
      orderIndex
    );

    requests.push(queueOrderRequest(request));
  }

  await settleOrderRequests(requests);
}

async function composeRegularRequests(exchange, credentials, data) {
  // Simple order requests don't have a price range.
  if (data.price?.from == null) {
    await composeSimpleRequests(exchange, credentials, data);

    return;
  }

  await composeScaledRequests(exchange, credentials, data);
}

export { composeRegularRequests };
