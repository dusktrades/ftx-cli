import { composeRegularRequests } from './regular/index.js';
import { composeTriggerRequests } from './trigger/index.js';

const TRIGGER_ORDER_TYPES = new Set([
  'stop-market',
  'stop-limit',
  'trailing-stop',
  'take-profit-market',
  'take-profit-limit',
]);

function isTriggerOrder(type) {
  return TRIGGER_ORDER_TYPES.has(type);
}

async function queueRequests({ exchange, credentials, data }) {
  if (isTriggerOrder(data.type)) {
    await composeTriggerRequests(exchange, credentials, data);

    return;
  }

  await composeRegularRequests(exchange, credentials, data);
}

async function place(options) {
  await queueRequests(options);
}

export { place };
