import { request } from '../request.js';

async function cancelOrders(options) {
  return request({
    ...options,
    rawEndpoint: 'orders',
    method: 'delete',
  });
}

export { cancelOrders };
