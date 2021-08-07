import { request } from '../request.js';

async function getMyLendingHistory(options) {
  return request({
    ...options,
    rawEndpoint: 'spot_margin/lending_history',
    method: 'get',
  });
}

export { getMyLendingHistory };
