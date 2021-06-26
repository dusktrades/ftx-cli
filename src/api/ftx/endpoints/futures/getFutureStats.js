import { composeHeaders } from '../composeHeaders.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

function composeEndpoint(parameters) {
  return `futures/${parameters.name}/stats`;
}

async function getFutureStats({ exchange, parameters }) {
  const endpoint = composeEndpoint(parameters);
  const url = composeUrl(exchange, endpoint);
  const headers = composeHeaders();

  return request({ url, headers });
}

export { getFutureStats };
