import { request } from '../request.js';

async function getSingleMarket(options) {
  return request({
    ...options,
    rawEndpoint: `markets/${options.pathParameters.market}`,
    method: 'get',
  });
}

export { getSingleMarket };
