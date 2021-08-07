import { request } from '../request.js';

async function placeTriggerOrder(options) {
  return request({
    ...options,
    rawEndpoint: 'conditional_orders',
    method: 'post',
  });
}

export { placeTriggerOrder };
