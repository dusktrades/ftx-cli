import BigNumber from 'bignumber.js';

import { orders } from '../../endpoints/index.js';
import { queues } from '../../queues/index.js';

function processPrice(data) {
  // Exchange decides price for market orders.
  if (data.type === 'market') {
    return null;
  }

  return data.price;
}

function processSize(data) {
  return new BigNumber(data.size).dividedBy(data.orderCount).toNumber();
}

function composeRequestBody(data) {
  return {
    market: data.market,
    side: data.side,
    type: data.type,
    price: processPrice(data),
    size: processSize(data),
  };
}

function composeRequest(exchange, credentials, data) {
  const requestBody = composeRequestBody(data);

  return orders.placeOrder({ exchange, credentials, requestBody });
}

function composeRequests(exchange, credentials, data) {
  const composeRequestFunction = () =>
    composeRequest(exchange, credentials, data);

  return Array.from({ length: data.orderCount }, () => composeRequestFunction);
}

async function place({ exchange, credentials, data }) {
  const requests = composeRequests(exchange, credentials, data);

  return queues.orders.addAll(requests);
}

export { place };
