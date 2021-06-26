import { composeHeaders } from '../composeHeaders.js';
import { composeQueryString } from '../composeQueryString.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

function composeEndpoint(parameters) {
  const queryString = composeQueryString(parameters);

  return `spot_margin/lending_history${queryString}`;
}

async function getMyLendingHistory({ exchange, credentials, parameters }) {
  const endpoint = composeEndpoint(parameters);
  const url = composeUrl(exchange, endpoint);
  const headers = composeHeaders({ endpoint, credentials });

  return request({ url, headers });
}

export { getMyLendingHistory };
