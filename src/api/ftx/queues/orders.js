import PQueue from 'p-queue';

const INTERVAL_MS = 200;
const MAX_ORDERS_PER_INTERVAL = 1;

/**
 * Do not send more than 1 order total per 200ms. Currently, FTX's 'soft' limit
 * for base-level accounts is 2 per 200ms, but we can't control exactly when the
 * orders are sent/received. We need to prioritise error-free consistency over
 * marginal speed improvements.
 */
const orders = new PQueue({
  interval: INTERVAL_MS,
  intervalCap: MAX_ORDERS_PER_INTERVAL,
});

export { orders };
