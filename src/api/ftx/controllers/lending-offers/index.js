import got from 'got';

import {
  convertPercentageToDecimal,
  convertYearlyToHourly,
  sortAlphabetically,
  truncate,
} from '../../../../util/index.js';

import { ENDPOINTS } from '../../endpoints.js';
import { COMMON_HEADERS, composeAuthenticationHeaders } from '../../headers.js';
import { composeUrl } from '../composeUrl.js';
import { handleError } from '../handleError.js';
import { testCurrency } from '../testCurrency.js';

/**
 * TODO: Fix sometimes still returning 'Size too large' errors. Related to
 * occasional stale API responses?
 */
function composeRequestBody(options) {
  return {
    coin: options.command.currency,

    // API returns 'Size too large' errors if using more than 8 decimal places.
    size: truncate(options.command.size, 8),

    // Prone to slight rounding inaccuracies (same issue on FTX platform).
    rate: convertPercentageToDecimal(
      convertYearlyToHourly(options.command.minRate)
    ),
  };
}

async function submit(options) {
  const endpoint = ENDPOINTS.LENDING_OFFERS;
  const url = composeUrl(endpoint, options.global.exchange);
  const requestBody = composeRequestBody(options);

  const headers = {
    ...COMMON_HEADERS,
    ...composeAuthenticationHeaders({
      method: 'post',
      endpoint,
      requestBody,
      options,
    }),
  };

  try {
    return {
      data: (await got.post(url, { headers, json: requestBody }).json()).result,
    };
  } catch (error) {
    return handleError(error);
  }
}

function testActive(filter, entry) {
  return filter != null ? entry.offered > 0 || entry.locked > 0 : true;
}

function filterData(data, filters) {
  if (filters == null) {
    return data;
  }

  return data.filter(
    (entry) =>
      testCurrency(filters.currencies, entry.coin) &&
      testActive(filters.active, entry) &&
      (filters.lendable ? entry.lendable > 0 : true) &&
      (filters.offered ? entry.offered > 0 : true)
  );
}

// TODO: Refactor.
function sortData(data, sortBy) {
  return [...data].sort((a, b) => {
    if (sortBy === 'lendable') {
      return b.lendable - a.lendable;
    }

    if (sortBy === 'offered') {
      return b.offered - a.offered;
    }

    if (sortBy === 'locked') {
      return b.locked - a.locked;
    }

    if (sortBy === 'min-rate') {
      return b.minRate - a.minRate;
    }

    return sortAlphabetically(a.coin, b.coin);
  });
}

async function get(options, filters) {
  // Lending info endpoint provides more detail than lending offers endpoint.
  const endpoint = ENDPOINTS.LENDING_INFO;
  const url = composeUrl(endpoint, options.global.exchange);

  const headers = {
    ...COMMON_HEADERS,
    ...composeAuthenticationHeaders({ method: 'get', endpoint, options }),
  };

  try {
    const data = (await got(url, { headers }).json()).result;
    const filteredData = filterData(data, filters);

    return { data: sortData(filteredData, options.command.sort) };
  } catch (error) {
    return handleError(error);
  }
}

async function create(options) {
  const lendableResponse = await get(options, {
    currencies: options.command.currency,
    lendable: true,
  });

  if (lendableResponse.error != null) {
    return lendableResponse;
  }

  const promises = options.command.currency.map((currency) => {
    const matchedLendableEntry = lendableResponse.data.find(
      (entry) => entry.coin === currency
    );

    const parsedOptions = {
      ...options,
      command: {
        currency,
        size:
          options.command.size == null
            ? matchedLendableEntry?.lendable ?? 0
            : options.command.size,
        minRate: options.command.minRate == null ? 0 : options.command.minRate,
      },
    };

    return submit(parsedOptions);
  });

  const responses = await Promise.all(promises);

  for (const response of responses) {
    if (response.error != null) {
      return response;
    }
  }

  return responses;
}

async function createAll(options) {
  const lendableResponse = await get(options, { lendable: true });

  if (lendableResponse.error != null) {
    return lendableResponse;
  }

  if (lendableResponse.data.length === 0) {
    return { error: 'No lendable currencies found' };
  }

  const promises = lendableResponse.data.map((entry) => {
    const parsedOptions = {
      ...options,
      command: {
        currency: entry.coin,
        size:
          options.command.size == null ? entry.lendable : options.command.size,
        minRate: options.command.minRate == null ? 0 : options.command.minRate,
      },
    };

    return submit(parsedOptions);
  });

  const responses = await Promise.all(promises);

  for (const response of responses) {
    if (response.error != null) {
      return response;
    }
  }

  return responses;
}

async function stop(options) {
  const promises = options.command.currency.map((currency) => {
    const parsedOptions = {
      ...options,
      command: { currency, size: 0, minRate: 0 },
    };

    return submit(parsedOptions);
  });

  const responses = await Promise.all(promises);

  for (const response of responses) {
    if (response.error != null) {
      return response;
    }
  }

  return responses;
}

async function stopAll(options) {
  const offeredResponse = await get(options, { offered: true });

  if (offeredResponse.error != null) {
    return offeredResponse;
  }

  const promises = offeredResponse.data.map((entry) => {
    const parsedOptions = {
      ...options,
      command: { currency: entry.coin, size: 0, minRate: 0 },
    };

    return submit(parsedOptions);
  });

  // TODO: Reuse.
  const responses = await Promise.all(promises);

  for (const response of responses) {
    if (response.error != null) {
      return response;
    }
  }

  return responses;
}

const lendingOffers = { get, create, createAll, stop, stopAll };

export { lendingOffers };
