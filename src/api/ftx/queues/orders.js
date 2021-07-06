import PQueue from 'p-queue';

const INTERVAL_MS = 200;
const MAX_ORDERS_PER_INTERVAL = 2;

// Do not send more than 2 orders total per 200ms.
const orders = new PQueue({
  interval: INTERVAL_MS,
  intervalCap: MAX_ORDERS_PER_INTERVAL,
});

export { orders };
