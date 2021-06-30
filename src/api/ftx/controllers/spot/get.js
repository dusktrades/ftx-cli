import { EmptyResultsError } from '../../../../common/errors/index.js';

import {
  compareAToZ,
  compareHighToLow,
  convertDecimalToPercentage,
} from '../../../../util/index.js';

import { markets } from '../../endpoints/index.js';
import { allowCurrency } from '../allowCurrency.js';

const LEVERAGED_TOKEN_TYPES = ['BULL', 'HALF', 'HEDGE', 'BEAR'];
const VOLATILITY_TOKEN_TYPES = ['BVOL', 'IBVOL'];

function isLeveragedToken(entry) {
  return LEVERAGED_TOKEN_TYPES.some((tokenType) =>
    entry.baseCurrency.includes(tokenType)
  );
}

function isVolatilityToken(entry) {
  return VOLATILITY_TOKEN_TYPES.some((tokenType) =>
    entry.baseCurrency.includes(tokenType)
  );
}

function isEquityToken(entry) {
  return Boolean(entry.tokenizedEquity);
}

function isCoin(entry) {
  return ![
    isLeveragedToken(entry),
    isVolatilityToken(entry),
    isEquityToken(entry),
  ].includes(true);
}

const TOKEN_TYPE_VALIDATORS = {
  coin: isCoin,
  'leveraged-token': isLeveragedToken,
  'volatility-token': isVolatilityToken,
  'equity-token': isEquityToken,
};

function allowType(allowedTypes, entry) {
  if (allowedTypes == null) {
    return true;
  }

  return allowedTypes.some((allowedType) =>
    TOKEN_TYPE_VALIDATORS[allowedType](entry)
  );
}

function filterData(data, filters) {
  if (filters == null) {
    return data;
  }

  return data.filter(
    (entry) =>
      entry.type === 'spot' &&
      allowCurrency(filters.currencies, entry.baseCurrency) &&
      allowType(filters.type, entry)
  );
}

function composeEntry(entry) {
  return {
    name: entry.name,
    quoteCurrency: entry.quoteCurrency,
    price: entry.price,
    change1hPercentage: convertDecimalToPercentage(entry.change1h),
    change24hPercentage: convertDecimalToPercentage(entry.change24h),
    volumeUsd24h: entry.volumeUsd24h,
  };
}

function composeData(data) {
  return data.map((entry) => composeEntry(entry));
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    compareAToZ(a.name, b.name)
  );

  if (sortBy === 'price') {
    return alphabeticalData.sort((a, b) => compareHighToLow(a.price, b.price));
  }

  if (sortBy === 'change-1h') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.change1hPercentage, b.change1hPercentage)
    );
  }

  if (sortBy === 'change-24h') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.change24hPercentage, b.change24hPercentage)
    );
  }

  if (sortBy === 'volume') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.volumeUsd24h, b.volumeUsd24h)
    );
  }

  return alphabeticalData;
}

function processData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);
  const composedData = composeData(filteredData);

  if (composedData.length === 0) {
    throw new EmptyResultsError('No spot markets found');
  }

  return sortData(composedData, sortBy);
}

async function get({ exchange, filters, sortBy }) {
  const data = await markets.getMarkets({ exchange });

  return processData(data, filters, sortBy);
}

export { get };
