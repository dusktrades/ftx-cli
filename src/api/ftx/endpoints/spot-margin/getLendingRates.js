import { composeHeaders } from '../composeHeaders.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

async function getLendingRates({ exchange }) {
  const endpoint = 'spot_margin/lending_rates';
  const url = composeUrl(exchange, endpoint);
  const headers = composeHeaders({ exchange });

  return request({ url, headers });
}

export { getLendingRates };
