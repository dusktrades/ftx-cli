import { composeHeaders } from '../composeHeaders.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

async function placeTriggerOrder({ exchange, credentials, requestBody }) {
  const endpoint = 'conditional_orders';
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

export { placeTriggerOrder };
