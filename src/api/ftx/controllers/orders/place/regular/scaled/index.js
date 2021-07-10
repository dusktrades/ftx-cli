import BigNumber from 'bignumber.js';

import { composeRequest } from '../composeRequest.js';

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

function composeScaledRequest(exchange, credentials, data, step, orderIndex) {
  const offset = step.multipliedBy(orderIndex);

  const processedData = {
    ...data,
    price: calculatePrice(data, offset),
  };

  return () => composeRequest(exchange, credentials, processedData);
}

function composeScaledRequests(exchange, credentials, data) {
  const step = calculateStep(data);

  return Array.from({ length: data.orderCount }, (_, orderIndex) =>
    composeScaledRequest(exchange, credentials, data, step, orderIndex)
  );
}

export { composeScaledRequests };
