import { request } from '../request.js';

async function getBalances(options) {
  return request({
    ...options,
    rawEndpoint: 'wallet/balances',
    method: 'get',
  });
}

export { getBalances };
