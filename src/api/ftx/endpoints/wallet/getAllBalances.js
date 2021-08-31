import { request } from '../request.js';

async function getAllBalances(options) {
  return request({
    ...options,
    rawEndpoint: 'wallet/all_balances',
    method: 'get',
  });
}

export { getAllBalances };
