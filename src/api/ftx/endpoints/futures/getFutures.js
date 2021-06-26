import { composeHeaders } from '../composeHeaders.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

async function getFutures({ exchange }) {
  const endpoint = 'futures';
  const url = composeUrl(exchange, endpoint);
  const headers = composeHeaders({ exchange });

  return request({ url, headers });
}

export { getFutures };
