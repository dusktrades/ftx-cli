import { composeBasicOrderRequest } from './composeBasicOrderRequest.js';
import { composeTriggerOrderRequest } from './composeTriggerOrderRequest.js';

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

function composeIndividualOrderRequest(exchange, credentials, data) {
  return isTriggerOrder(data.type)
    ? composeTriggerOrderRequest(exchange, credentials, data)
    : composeBasicOrderRequest(exchange, credentials, data);
}

export { composeIndividualOrderRequest };
