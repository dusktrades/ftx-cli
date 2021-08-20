import { request } from '../request.js';

async function getMarkets(options) {
  return request({
    ...options,
    rawEndpoint: 'markets',
    method: 'get',
  });
}

export { getMarkets };
