import { composeRequest } from '../composeRequest.js';

function composeSimpleRequest(exchange, credentials, data) {
  return () => composeRequest(exchange, credentials, data);
}

function composeSimpleRequests(exchange, credentials, data) {
  return Array.from({ length: data.orderCount }, () =>
    composeSimpleRequest(exchange, credentials, data)
  );
}

export { composeSimpleRequests };
