import got from 'got';

import { ENDPOINTS } from '../../endpoints.js';
import { COMMON_HEADERS } from '../../headers.js';
import { composeUrl } from '../composeUrl.js';
import { handleError } from '../handleError.js';
import { testCurrency } from '../testCurrency.js';

function filterData(data, filters) {
  if (filters == null) {
    return data;
  }

  return data.filter((entry) => testCurrency(filters.currencies, entry.coin));
}

async function get(options, filters) {
  const url = composeUrl(ENDPOINTS.LENDING_RATES, options.global.exchange);

  try {
    const data = (await got(url, { headers: COMMON_HEADERS }).json()).result;

    return { data: filterData(data, filters) };
  } catch (error) {
    return handleError(error);
  }
}

const lendingRates = { get };

export { lendingRates };
