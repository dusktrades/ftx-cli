import { request } from '../request.js';

async function getPositions(options) {
  return request({
    ...options,
    rawEndpoint: 'positions',
    queryParameters: { showAvgPrice: true },
    method: 'get',
  });
}

export { getPositions };
