import { request } from '../request.js';

async function placeOrder(options) {
  return request({
    ...options,
    rawEndpoint: 'orders',
    method: 'post',
  });
}

export { placeOrder };
