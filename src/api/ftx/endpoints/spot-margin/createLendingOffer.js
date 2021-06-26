import { composeHeaders } from '../composeHeaders.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

async function createLendingOffer({ exchange, credentials, requestBody }) {
  const endpoint = 'spot_margin/offers';
  const url = composeUrl(exchange, endpoint);
  const method = 'post';

  const headers = composeHeaders({
    exchange,
    endpoint,
    method,
    credentials,
    requestBody,
  });

  return request({ url, method, headers, requestBody });
}

export { createLendingOffer };
