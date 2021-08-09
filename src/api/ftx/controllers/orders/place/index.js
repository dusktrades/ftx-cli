import BigNumber from 'bignumber.js';

import { queues } from '../../../queues/index.js';
import { composeRequest } from './composeRequest.js';
import { queueOrderRequest } from './queueOrderRequest.js';
import { settleOrderRequests } from './settleOrderRequests.js';

function calculateDifference({ from, to }) {
  return to.minus(from);
}

function calculateAdditionalSplitCount(splitCount) {
  return splitCount.minus(new BigNumber(1));
}

function calculateStep(data) {
  const difference = calculateDifference(data.price);

  if (difference.isZero()) {
    return new BigNumber(0);
  }

  const additionalSplitCount = calculateAdditionalSplitCount(data.splitCount);

  if (additionalSplitCount.isZero()) {
    return new BigNumber(0);
  }

  return difference.dividedBy(additionalSplitCount);
}

function calculateOffset(step, orderIndex) {
  return step.multipliedBy(new BigNumber(orderIndex));
}

function calculatePrice(fromPrice, step, orderIndex) {
  const offset = calculateOffset(step, orderIndex);

  return fromPrice.plus(offset);
}

function composeScaledRequest(exchange, credentials, data, step, orderIndex) {
  const processedData = {
    ...data,
    price: calculatePrice(data.price.from, step, orderIndex),
  };

  return composeRequest(exchange, credentials, processedData);
}

async function composeScaledRequests(exchange, credentials, data, queue) {
  const requests = [];
  const step = calculateStep(data);

  for (
    let orderIndex = 0;
    orderIndex < data.splitCount.toNumber();
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
    orderIndex < data.splitCount.toNumber();
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
