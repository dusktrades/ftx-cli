import { request } from '../request.js';

async function createLendingOffer(options) {
  return request({
    ...options,
    rawEndpoint: 'spot_margin/offers',
    method: 'post',
  });
}

export { createLendingOffer };
