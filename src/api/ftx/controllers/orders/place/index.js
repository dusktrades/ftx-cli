import { queues } from '../../../queues/index.js';
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

function composeRequests(exchange, credentials, data) {
  if (isTriggerOrder(data.type)) {
    return composeTriggerRequests(exchange, credentials, data);
  }

  return composeRegularRequests(exchange, credentials, data);
}

async function place({ exchange, credentials, data }) {
  const requests = composeRequests(exchange, credentials, data);

  return queues.orders.addAll(requests);
}

export { place };
