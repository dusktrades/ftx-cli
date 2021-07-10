import { composeSimpleRequests } from './simple/index.js';

function composeTriggerRequests(exchange, credentials, data) {
  return composeSimpleRequests(exchange, credentials, data);
}

export { composeTriggerRequests };
