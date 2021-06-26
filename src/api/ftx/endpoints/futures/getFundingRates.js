import { composeHeaders } from '../composeHeaders.js';
import { composeQueryString } from '../composeQueryString.js';
import { composeUrl } from '../composeUrl.js';
import { request } from '../request.js';

function composeEndpoint(parameters) {
  const queryString = composeQueryString(parameters);

  return `funding_rates${queryString}`;
}

async function getFundingRates({ exchange, parameters }) {
  const endpoint = composeEndpoint(parameters);
  const url = composeUrl(exchange, endpoint);
  const headers = composeHeaders({ exchange });

  return request({ url, headers });
}

export { getFundingRates };
