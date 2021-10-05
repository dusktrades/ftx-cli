import { EmptyResultsError } from '../../../../common/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { markets } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';
import { sortData } from '../sortData.js';

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

function composeSortCompare(sortBy) {
  switch (sortBy) {
    case 'price':
      return (a, b) => compareHighToLow(a.marketPrice, b.marketPrice);
    case 'change-1h':
      return (a, b) => compareHighToLow(a.change1h, b.change1h);
    case 'change-24h':
      return (a, b) => compareHighToLow(a.change24h, b.change24h);
    case 'volume':
      return (a, b) => compareHighToLow(a.volumeUsd24h, b.volumeUsd24h);
    default:
      return null;
  }
}

function initialCompare(a, b) {
  return compareAToZ(a.name, b.name);
}

function collateData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);

  if (filteredData.length === 0) {
    throw new EmptyResultsError('No spot markets found');
  }

  const normalisedData = normaliseData(filteredData);
  const sortCompare = composeSortCompare(sortBy);

  return sortData(normalisedData, initialCompare, sortCompare);
}

async function get({ exchange, filters, sortBy }) {
  const data = await markets.getMarkets({ exchange });

  return collateData(data, filters, sortBy);
}

export { get };
