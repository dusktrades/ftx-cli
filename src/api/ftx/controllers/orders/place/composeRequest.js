import { composeRegularRequest } from './regular/index.js';
import { composeTriggerRequest } from './trigger/index.js';

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

function composeRequest(exchange, credentials, data, enableColours) {
  return isTriggerOrder(data.type)
    ? composeTriggerRequest(exchange, credentials, data)
    : composeRegularRequest(exchange, credentials, data, enableColours);
}

export { composeRequest };
