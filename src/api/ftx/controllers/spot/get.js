import { EmptyResultsError } from '../../../../common/index.js';

import {
  compareAToZ,
  compareHighToLow,
  convertDecimalToPercentage,
} from '../../../../util/index.js';

import { markets } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';

const fiatCurrencies = new Set([
  'BRZ',
  'CAD',
  'EUR',
  'GBP',
  'SGD',
  'TRYB',
  'USD',
  'USDT',
]);

const leveragedTokenTypes = ['BEAR', 'BULL', 'HALF', 'HEDGE'];
const volatilityTokens = new Set(['BVOL', 'IBVOL']);

function isFiat(baseCurrency) {
  return fiatCurrencies.has(baseCurrency);
}

function isLeveragedToken(baseCurrency) {
  return leveragedTokenTypes.some((tokenType) =>
    baseCurrency.includes(tokenType)
  );
}

function isVolatilityToken(baseCurrency) {
  return volatilityTokens.has(baseCurrency);
}

function isStock(flag) {
  return Boolean(flag);
}

function getType(entry) {
  if (isFiat(entry.baseCurrency)) {
    return 'fiat';
  }

  if (isLeveragedToken(entry.baseCurrency)) {
    return 'leveraged';
  }

  if (isVolatilityToken(entry.baseCurrency)) {
    return 'volatility';
  }

  if (isStock(entry.tokenizedEquity)) {
    return 'stock';
  }

  return 'coin';
}

function allowType(allowedTypes, entry) {
  if (allowedTypes == null) {
    return true;
  }

  const type = getType(entry);

  return allowedTypes.includes(type);
}

function allowTokenLeverage(allowedTokenLeverages, baseCurrency) {
  if (allowedTokenLeverages == null) {
    return true;
  }

  return allowedTokenLeverages.some((allowedTokenLeverage) =>
    baseCurrency.includes(allowedTokenLeverage)
  );
}

function filterData(data, filters) {
  return data.filter(
    (entry) =>
      entry.type === 'spot' &&
      allowValue(filters.currencies, entry.baseCurrency) &&
      allowType(filters.type, entry) &&
      allowValue(filters.quoteCurrencies, entry.quoteCurrency) &&
      allowTokenLeverage(filters.tokenLeverage, entry.baseCurrency)
  );
}

function normaliseEntry(entry) {
  return {
    name: entry.name,
    quoteCurrency: entry.quoteCurrency,
    price: entry.price,
    change1hPercentage: convertDecimalToPercentage(entry.change1h),
    change24hPercentage: convertDecimalToPercentage(entry.change24h),
    volumeUsd24h: entry.volumeUsd24h,
  };
}

function normaliseData(data) {
  return data.map((entry) => normaliseEntry(entry));
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    compareAToZ(a.name, b.name)
  );

  if (['price', 'p'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) => compareHighToLow(a.price, b.price));
  }

  if (['change-1h', 'c1'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.change1hPercentage, b.change1hPercentage)
    );
  }

  if (['change-24h', 'c24'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.change24hPercentage, b.change24hPercentage)
    );
  }

  if (['volume', 'v'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.volumeUsd24h, b.volumeUsd24h)
    );
  }

  return alphabeticalData;
}

async function get({ exchange, filters, sortBy }) {
  const data = await markets.getMarkets({ exchange });
  const filteredData = filterData(data, filters);
  const normalisedData = normaliseData(filteredData);

  if (normalisedData.length === 0) {
    throw new EmptyResultsError('No spot markets found');
  }

  return sortData(normalisedData, sortBy);
}

export { get };
