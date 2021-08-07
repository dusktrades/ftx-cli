import { request } from '../request.js';

async function getLendingRates(options) {
  return request({
    ...options,
    rawEndpoint: 'spot_margin/lending_rates',
    method: 'get',
  });
}

export { getLendingRates };
