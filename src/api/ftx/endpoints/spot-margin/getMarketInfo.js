import { request } from '../request.js';

async function getMarketInfo(options) {
  return request({
    ...options,
    rawEndpoint: 'spot_margin/market_info',
    method: 'get',
  });
}

export { getMarketInfo };
