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

function composeRequestBody(data) {
  return {
    market: data.market,
    side: data.side,
    type: data.type,
    price: processPrice(data),
    size: processSize(data),
  };
}

function composeRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return orders.placeOrder({ exchange, credentials, requestBody });
}

function calculateStep(data) {
  const difference = data.price.to.minus(data.price.from);
  const additionalOrderCount = data.orderCount.minus(new BigNumber(1));

  if (additionalOrderCount.isZero()) {
    return new BigNumber(0);
  }

  return difference.dividedBy(additionalOrderCount);
}

function composeRequests(exchange, credentials, data) {
  const composeSimpleRequest = () =>
    composeRequest(exchange, credentials, data);

  // Simple price.
  if (data.price.from == null) {
    return Array.from({ length: data.orderCount }, () => composeSimpleRequest);
  }

  // Price range.
  const step = calculateStep(data);

  return Array.from({ length: data.orderCount }, (_, orderIndex) => {
    const offset = step.multipliedBy(orderIndex);

    const processedData = {
      ...data,
      price: data.price.from.plus(offset),
    };

    return () => composeRequest(exchange, credentials, processedData);
  });
}

async function place({ exchange, credentials, data }) {
  const requests = composeRequests(exchange, credentials, data);

  return queues.orders.addAll(requests);
}

export { place };
