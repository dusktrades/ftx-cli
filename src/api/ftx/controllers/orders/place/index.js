import BigNumber from 'bignumber.js';

import { queues } from '../../../queues/index.js';
import { composeRequest } from './composeRequest.js';
import { queueOrderRequest } from './queueOrderRequest.js';
import { settleOrderRequests } from './settleOrderRequests.js';

const FILL_DIRECTIONS = {
  LOW_TO_HIGH: 'low_to_high',
  HIGH_TO_LOW: 'high_to_low',
};

function calculateStep(data) {
  const difference = data.price.to.minus(data.price.from);
  const additionalOrderCount = data.orderCount.minus(new BigNumber(1));

  if (additionalOrderCount.isZero()) {
    return new BigNumber(0);
  }

  return difference.dividedBy(additionalOrderCount);
}

function getStopFillDirection(side) {
  /**
   * Stop sell orders fill high-to-low.
   * Stop buy orders fill low-to-high.
   */
  return side === 'sell'
    ? FILL_DIRECTIONS.HIGH_TO_LOW
    : FILL_DIRECTIONS.LOW_TO_HIGH;
}

function getFillDirection(data) {
  if (['stop-market', 'stop-limit'].includes(data.type)) {
    return getStopFillDirection(data.side);
  }

  /**
   * Non-stop sell orders fill low-to-high.
   * Non-stop buy orders fill high-to-low.
   */
  return data.side === 'sell'
    ? FILL_DIRECTIONS.LOW_TO_HIGH
    : FILL_DIRECTIONS.HIGH_TO_LOW;
}

/**
 * Calculate price based on order type/side so we can prioritise placing orders
 * outwards from the spread. This is 'best-effort' because we send order
 * requests in parallel and FTX decides order placements/rejections.
 */
function calculatePrice(data, offset) {
  const fillDirection = getFillDirection(data);

  if (fillDirection === FILL_DIRECTIONS.LOW_TO_HIGH) {
    return data.price.from.plus(offset);
  }

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

async function composeScaledRequests(exchange, credentials, data, queue) {
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

    requests.push(queueOrderRequest(request, queue));
  }

  await settleOrderRequests(requests);
}

async function composeSimpleRequests(exchange, credentials, data, queue) {
  const requests = [];
  const request = composeRequest(exchange, credentials, data);

  for (
    let orderIndex = 0;
    orderIndex < data.orderCount.toNumber();
    orderIndex += 1
  ) {
    requests.push(queueOrderRequest(request, queue));
  }

  await settleOrderRequests(requests);
}

async function place({ exchange, credentials, data }) {
  const queue = queues.orders.create(data.rateLimit);

  // Scaled order requests have a price range.
  await (data.price?.from != null
    ? composeScaledRequests(exchange, credentials, data, queue)
    : composeSimpleRequests(exchange, credentials, data, queue));
}

export { place };
