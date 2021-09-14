import { request } from '../request.js';

async function getAccountInformation(options) {
  return request({
    ...options,
    rawEndpoint: 'account',
    method: 'get',
  });
}

export { getAccountInformation };
