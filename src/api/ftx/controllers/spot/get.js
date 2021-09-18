import { EmptyResultsError } from '../../../../common/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
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
  return leveragedTokenTypes.some((type) => baseCurrency.includes(type));
}

function isVolatilityToken(baseCurrency) {
  return volatilityTokens.has(baseCurrency);
}

function isStock(flag) {
  return Boolean(flag);
}

function getType({ baseCurrency, tokenizedEquity }) {
  if (isFiat(baseCurrency)) {
    return 'fiat';
  }

  if (isLeveragedToken(baseCurrency)) {
    return 'leveraged';
  }

  if (isVolatilityToken(baseCurrency)) {
    return 'volatility';
  }

  if (isStock(tokenizedEquity)) {
    return 'stock';
  }

  return 'coin';
}

function allowType(allowed, entry) {
  return allowed == null ? true : allowed.includes(getType(entry));
}

function allowTokenLeverage(allowed, baseCurrency) {
  return allowed == null
    ? true
    : allowed.some((entry) => baseCurrency.includes(entry));
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
    baseCurrency: entry.baseCurrency,
    quoteCurrency: entry.quoteCurrency,
    marketPrice: entry.price,
    change1h: entry.change1h,
    change24h: entry.change24h,
    volumeUsd24h: entry.volumeUsd24h,
  };
}

function normaliseData(data) {
  return data.map((entry) => normaliseEntry(entry));
}

function composeCompareFunction(sortBy) {
  if (['price', 'p'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.marketPrice, b.marketPrice);
  }

  if (['change-1h', 'c1'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.change1h, b.change1h);
  }

  if (['change-24h', 'c24'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.change24h, b.change24h);
  }

  if (['volume', 'v'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.volumeUsd24h, b.volumeUsd24h);
  }

  return null;
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    compareAToZ(a.name, b.name)
  );

  const compareFunction = composeCompareFunction(sortBy);

  return compareFunction == null
    ? alphabeticalData
    : alphabeticalData.sort(compareFunction);
}

function collateData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);

  if (filteredData.length === 0) {
    throw new EmptyResultsError('No spot markets found');
  }

  const normalisedData = normaliseData(filteredData);

  return sortData(normalisedData, sortBy);
}

async function get({ exchange, filters, sortBy }) {
  const data = await markets.getMarkets({ exchange });

  return collateData(data, filters, sortBy);
}

export { get };
