import { queueOrderRequest } from '../queueOrderRequest.js';
import { settleOrderRequests } from '../settleOrderRequests.js';
import { composeRequest } from './composeRequest.js';

async function composeSimpleRequests(exchange, credentials, data) {
  const requests = [];
  const request = composeRequest(exchange, credentials, data);

  for (
    let orderIndex = 0;
    orderIndex < data.orderCount.toNumber();
    orderIndex += 1
  ) {
    requests.push(queueOrderRequest(request));
  }

  await settleOrderRequests(requests);
}

function composeTriggerRequests(exchange, credentials, data) {
  return composeSimpleRequests(exchange, credentials, data);
}

export { composeTriggerRequests };
