import { composeScaledRequests } from './scaled/index.js';
import { composeSimpleRequests } from './simple/index.js';

function composeRegularRequests(exchange, credentials, data) {
  if (data.price?.from == null) {
    return composeSimpleRequests(exchange, credentials, data);
  }

  return composeScaledRequests(exchange, credentials, data);
}

export { composeRegularRequests };
