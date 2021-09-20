import PQueue from 'p-queue';

import {
  ExchangeUnavailableError,
  RateLimitError,
  Logger,
} from '../../../../../common/index.js';

let queue = null;
let shouldRetryExchangeUnavailable = false;

function handleRequestSuccess() {
  Logger.info('  Placed order');
}

function shouldRetryRequest(error) {
  // Always retry requests which exceed the rate limit.
  if (error instanceof RateLimitError) {
    return true;
  }

  // Retry requests when the exchange is unavailable if user has configured it.
  return (
    error instanceof ExchangeUnavailableError && shouldRetryExchangeUnavailable
  );
}

function handleRequestError(error, retry) {
  if (shouldRetryRequest(error)) {
    return retry();
  }

  // Order failed due to some other reason: notify and rethrow.
  Logger.error(
    `  Failed individual order: ${error?.message ?? 'Unhandled error'}`
  );

  throw error;
}

function add(request, priority = 0) {
  // Retry with increased priority.
  function retry() {
    return add(request, priority + 1);
  }

  return queue
    .add(request, { priority })
    .then(handleRequestSuccess)
    .catch((error) => handleRequestError(error, retry));
}

/**
 * Do not send more than 6 orders total per 200ms by default.
 *
 * Current FTX base-level account order placement rate limits:
 *
 * - Soft limit: 2/200ms
 * - Hard limit: 6/200ms
 *
 * We implement 'dynamic' rate limits by retrying queued order requests which
 * throw rate limit exceptions.
 *
 * Users have the option to override the maximum number of orders placed per
 * 200ms for accounts in higher/VIP tiers (more lenient rate limits) and forward
 * compatibility (not forcing updates when FTX change rate limits).
 *
 * Reference: https://help.ftx.com/hc/en-us/articles/360052595091-Ratelimits-on-FTX
 */
function createOrderQueue({ rateLimit, retryExchangeUnavailable }) {
  shouldRetryExchangeUnavailable = retryExchangeUnavailable;

  queue = new PQueue({
    interval: rateLimit.intervalMilliseconds,
    intervalCap: rateLimit.limitPerInterval,

    /**
     * If the next interval begins with pending promises, they will carry over
     * and count towards its request limit.
     */
    carryoverConcurrencyCount: true,
  });

  queue.on('error', () => {
    /**
     * TODO: Order queue error flow:
     *
     * 1. Pause queue
     * 2. Prompt user with 'An order sent as part of this action failed to
     * be placed. How would you like to continue?'
     * 3. Ignore and continue? Continue queue
     * 4. Cancel queued orders? Clear queue: `orders.clear()`
     * 5. Cancel queued and existing orders? Clear queue and cancel via API
     * 6. *If prompt is shown, add a 60s timeout before ignoring and continuing
     * so we don't get stuck waiting forever
     *
     * Also add inline/config options to customise behaviour:
     *
     * - `ORDER_REJECTION_ACTION` [prompt (default)|ignore|cancel-queued|cancel-all]
     *
     * We should probably halt execution if the error is unhandled.
     */
  });

  return { add };
}

export { createOrderQueue };
