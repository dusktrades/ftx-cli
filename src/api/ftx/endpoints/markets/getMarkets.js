import { composeHeaders } from '../composeHeaders.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

async function getMarkets({ exchange }) {
  const endpoint = 'markets';
  const url = composeUrl(exchange, endpoint);
  const headers = composeHeaders({ exchange });

  return request({ url, headers });
}

export { getMarkets };
