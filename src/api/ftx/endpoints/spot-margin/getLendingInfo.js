import { composeHeaders } from '../composeHeaders.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

async function getLendingInfo({ exchange, credentials }) {
  const endpoint = 'spot_margin/lending_info';
  const url = composeUrl(exchange, endpoint);
  const headers = composeHeaders({ exchange, endpoint, credentials });

  return request({ url, headers });
}

export { getLendingInfo };
