import { request } from '../request.js';

async function getFutureStats(options) {
  return request({
    ...options,
    rawEndpoint: `futures/${options.pathParameters.name}/stats`,
    method: 'get',
  });
}

export { getFutureStats };
