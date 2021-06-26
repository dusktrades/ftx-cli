import { composeHeaders } from '../composeHeaders.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

async function getUserRewards({ exchange, credentials }) {
  const endpoint = 'user_rewards';
  const url = composeUrl(exchange, endpoint);
  const headers = composeHeaders({ exchange, endpoint, credentials });

  return request({ url, headers });
}

export { getUserRewards };
