import { composeRegularRequest } from './regular/index.js';
import { composeTriggerRequest } from './trigger/index.js';

const triggerOrderTypes = new Set([
  'stop-market',
  'stop-limit',
  'trailing-stop',
  'take-profit-market',
  'take-profit-limit',
]);

function isTriggerOrder(type) {
  return triggerOrderTypes.has(type);
}

async function composeRequest(exchange, credentials, data) {
  return isTriggerOrder(data.type)
    ? composeTriggerRequest(exchange, credentials, data)
    : composeRegularRequest(exchange, credentials, data);
}

export { composeRequest };
