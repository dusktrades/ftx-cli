import BigNumber from 'bignumber.js';

import { Logger, RateLimitError } from '../../../../../common/index.js';
import { sleep } from '../../../../../util/index.js';
import { queues } from '../../../queues/index.js';
import { composeRequest } from './composeRequest.js';
import { settleOrderRequests } from './settleOrderRequests.js';

function calculateAdditionalOrderCount(splitCount) {
  return splitCount.minus(1);
}

function calculateIntervalMilliseconds({ durationMilliseconds, splitCount }) {
  if (durationMilliseconds.isZero()) {
    return new BigNumber(0);
  }

  const additionalOrderCount = calculateAdditionalOrderCount(splitCount);

  if (additionalOrderCount.isZero()) {
    return new BigNumber(0);
  }

  return durationMilliseconds.dividedBy(additionalOrderCount);
}

function calculateDifference({ from, to }) {
  return to.minus(from);
}

function calculateStep({ price, splitCount }) {
  const difference = calculateDifference(price);

  if (difference.isZero()) {
    return new BigNumber(0);
  }

  const additionalOrderCount = calculateAdditionalOrderCount(splitCount);

  if (additionalOrderCount.isZero()) {
    return new BigNumber(0);
  }

  return difference.dividedBy(additionalOrderCount);
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

function calculateOrderDelayMilliseconds(intervalMilliseconds, orderIndex) {
  return intervalMilliseconds.multipliedBy(orderIndex);
}

function handleOrderRequestError(error, retry, enableColours) {
  if (error instanceof RateLimitError) {
    // Order failed due to exceeding rate limit; retry with increased priority.
    return retry();
  }

  // Order failed due to some other reason; notify and rethrow.
  Logger.error(`  Order failed: ${error.message}`, { enableColours });

  throw error;
}

function queueOrderRequest(request, queue, enableColours, priority = 0) {
  function retry() {
    return queueOrderRequest(request, queue, enableColours, priority + 1);
  }

  return queue
    .add(request, { priority })
    .then(() => {
      Logger.info('  Order placed', { enableColours });
    })
    .catch((error) => handleOrderRequestError(error, retry, enableColours));
}

async function controlOrderRequestTiming(
  request,
  queue,
  orderDelayMilliseconds,
  enableColours
) {
  if (orderDelayMilliseconds > 0) {
    await sleep(orderDelayMilliseconds);
  }

  return queueOrderRequest(request, queue, enableColours);
}

async function composeScaledRequests(
  exchange,
  credentials,
  data,
  enableColours,
  queue,
  intervalMilliseconds
) {
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

    const orderDelayMilliseconds = calculateOrderDelayMilliseconds(
      intervalMilliseconds,
      orderIndex
    );

    const timedRequest = controlOrderRequestTiming(
      request,
      queue,
      orderDelayMilliseconds,
      enableColours
    );

    /**
     * TODO: Compose requests on the fly; current method won't work with dynamic
     * arguments such as prices relative to the market.
     */
    requests.push(timedRequest);
  }

  await settleOrderRequests(requests);
}

async function composeSimpleRequests(
  exchange,
  credentials,
  data,
  enableColours,
  queue,
  intervalMilliseconds
) {
  const requests = [];
  const request = composeRequest(exchange, credentials, data);

  for (
    let orderIndex = 0;
    orderIndex < data.splitCount.toNumber();
    orderIndex += 1
  ) {
    const orderDelayMilliseconds = calculateOrderDelayMilliseconds(
      intervalMilliseconds,
      orderIndex
    );

    const timedRequest = controlOrderRequestTiming(
      request,
      queue,
      orderDelayMilliseconds,
      enableColours
    );

    requests.push(timedRequest);
  }

  await settleOrderRequests(requests);
}

async function place({ exchange, credentials, data, enableColours }) {
  const queue = queues.orders.create(data.rateLimit);
  const intervalMilliseconds = calculateIntervalMilliseconds(data);

  // Scaled order requests have a price range.
  await (data.price?.from != null
    ? composeScaledRequests(
        exchange,
        credentials,
        data,
        enableColours,
        queue,
        intervalMilliseconds
      )
    : composeSimpleRequests(
        exchange,
        credentials,
        data,
        enableColours,
        queue,
        intervalMilliseconds
      ));
}

export { place };
