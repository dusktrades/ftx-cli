import { request } from '../request.js';

async function getFutures(options) {
  return request({
    ...options,
    rawEndpoint: 'futures',
    method: 'get',
  });
}

export { getFutures };
