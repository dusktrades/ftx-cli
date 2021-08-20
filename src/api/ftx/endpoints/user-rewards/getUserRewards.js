import { request } from '../request.js';

async function getUserRewards(options) {
  return request({
    ...options,
    rawEndpoint: 'user_rewards',
    method: 'get',
  });
}

export { getUserRewards };
