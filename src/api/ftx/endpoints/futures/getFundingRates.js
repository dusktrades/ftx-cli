import { request } from '../request.js';

async function getFundingRates(options) {
  return request({
    ...options,
    rawEndpoint: 'funding_rates',
    method: 'get',
  });
}

export { getFundingRates };
