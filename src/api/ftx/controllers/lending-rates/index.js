import got from 'got';

import { sortAlphabetically } from '../../../../util/index.js';
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

function sortData(data, sortBy) {
  return [...data].sort((a, b) => {
    if (sortBy === 'previous') {
      return b.previous - a.previous;
    }

    if (sortBy === 'estimated') {
      return b.estimate - a.estimate;
    }

    return sortAlphabetically(a.coin, b.coin);
  });
}

async function get(options, filters) {
  const url = composeUrl(ENDPOINTS.LENDING_RATES, options.global.exchange);

  try {
    const data = (await got(url, { headers: COMMON_HEADERS }).json()).result;
    const filteredData = filterData(data, filters);

    return { data: sortData(filteredData, options.command.sort) };
  } catch (error) {
    return handleError(error);
  }
}

const lendingRates = { get };

export { lendingRates };
