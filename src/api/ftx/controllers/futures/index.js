import got from 'got';

import { sortAlphabetically, sortHighToLow } from '../../../../util/index.js';
import { ENDPOINTS } from '../../endpoints.js';
import { COMMON_HEADERS } from '../../headers.js';
import { composeUrl } from '../composeUrl.js';
import { fundingRates } from '../funding-rates/index.js';
import { handleError } from '../handleError.js';

function allowName(entry, filters) {
  if (filters.currencies == null) {
    return true;
  }

  // Future names are formatted '{CURRENCY}-X'.
  const futureCurrency = entry.name.split('-')[0];

  return filters.currencies.includes(futureCurrency);
}

function filterData(data, filters) {
  if (filters == null) {
    return data;
  }

  return data.filter(
    (entry) =>
      allowName(entry, filters) &&
      (filters.type == null ? true : filters.type === entry.type)
  );
}

async function get(options, filters) {
  const url = composeUrl(ENDPOINTS.FUTURES, options.global.exchange);

  try {
    const data = (await got(url, { headers: COMMON_HEADERS }).json()).result;
    const filteredData = filterData(data, filters);

    return { data: filteredData };
  } catch (error) {
    return handleError(error);
  }
}

async function getStatsRaw(options) {
  const url = composeUrl(
    ENDPOINTS.FUTURE_STATS(options.command.currency),
    options.global.exchange
  );

  try {
    return {
      data: (await got(url, { headers: COMMON_HEADERS }).json()).result,
    };
  } catch (error) {
    return handleError(error);
  }
}

async function getPartialStats(options) {
  const futuresResponse = await get(options, {
    currencies: options.command.currency,
    type: options.command.type,
  });

  if (futuresResponse.error != null) {
    return futuresResponse;
  }

  if (futuresResponse.data.length === 0) {
    return { error: 'No futures found' };
  }

  const promises = futuresResponse.data.map((entry) => {
    const parsedOptions = {
      ...options,
      command: { ...options.command, currency: entry.name },
    };

    return getStatsRaw(parsedOptions);
  });

  const responses = await Promise.all(promises);

  for (const response of responses) {
    if (response.error != null) {
      return response;
    }
  }

  const normalisedData = responses.map((entry, index) => ({
    ...futuresResponse.data[index],
    ...entry.data,
  }));

  return { data: normalisedData };
}

function calculateChangePercentage(change) {
  return change * 100;
}

function calculateOpenInterestUsd(openInterest, lastPriceUsd) {
  return openInterest * lastPriceUsd;
}

function composeData(futuresStats, previousFundingRates) {
  return futuresStats.data.map((futuresStatsEntry) => {
    const previousFundingRatesEntry = previousFundingRates.data.find(
      (entry) => entry.future === futuresStatsEntry.name
    );

    // Sometimes returns null.
    const openInterest = futuresStatsEntry.openInterest ?? 0;

    return {
      name: futuresStatsEntry.name,
      underlying: futuresStatsEntry.underlying,
      change1hPercentage: calculateChangePercentage(futuresStatsEntry.change1h),
      change24hPercentage: calculateChangePercentage(
        futuresStatsEntry.change24h
      ),
      lastPrice: futuresStatsEntry.last,
      markPrice: futuresStatsEntry.mark,
      volume24h: futuresStatsEntry.volume,
      volumeUsd24h: futuresStatsEntry.volumeUsd24h,
      openInterest,
      openInterestUsd: calculateOpenInterestUsd(
        openInterest,
        futuresStatsEntry.last
      ),
      previousFundingRate: previousFundingRatesEntry?.rate,
      nextFundingRate: futuresStatsEntry.nextFundingRate,
    };
  });
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    sortAlphabetically(a.name, b.name)
  );

  if (sortBy === 'last-price') {
    return alphabeticalData.sort((a, b) =>
      sortHighToLow(a.lastPrice, b.lastPrice)
    );
  }

  if (sortBy === 'mark-price') {
    return alphabeticalData.sort((a, b) =>
      sortHighToLow(a.markPrice, b.markPrice)
    );
  }

  if (sortBy === 'volume') {
    return alphabeticalData.sort((a, b) =>
      sortHighToLow(a.volumeUsd24h, b.volumeUsd24h)
    );
  }

  if (['open-interest', 'oi'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      sortHighToLow(a.openInterestUsd, b.openInterestUsd)
    );
  }

  if (sortBy === 'previous-funding') {
    return alphabeticalData.sort((a, b) =>
      sortHighToLow(a.previousFundingRate, b.previousFundingRate)
    );
  }

  if (sortBy === 'estimated-funding') {
    return alphabeticalData.sort((a, b) =>
      sortHighToLow(a.nextFundingRate, b.nextFundingRate)
    );
  }

  return alphabeticalData;
}

async function getStats(options) {
  const [futuresStats, previousFundingRates] = await Promise.all([
    getPartialStats(options),
    fundingRates.getPrevious(options, {
      currencies: options.command.currency,
    }),
  ]);

  if (futuresStats.error != null) {
    return futuresStats;
  }

  if (previousFundingRates.error != null) {
    return previousFundingRates;
  }

  const data = composeData(futuresStats, previousFundingRates);

  return { data: sortData(data, options.command.sort) };
}

const futures = { getStats };

export { futures };
