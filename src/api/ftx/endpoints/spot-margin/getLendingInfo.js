import { request } from '../request.js';

async function getLendingInfo(options) {
  return request({
    ...options,
    rawEndpoint: 'spot_margin/lending_info',
    method: 'get',
  });
}

export { getLendingInfo };
