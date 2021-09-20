import { EmptyResultsError } from '../../../../common/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { futures } from '../../endpoints/index.js';
import { get } from './get.js';
import { getPreviousFunding } from './getPreviousFunding.js';

function composeRequest(exchange, name) {
  return futures.getFutureStats({ exchange, pathParameters: { name } });
}

function composeRequests(exchange, futuresList) {
  return futuresList.map(({ name }) => composeRequest(exchange, name));
}

async function fetchIncompleteStats(exchange, futuresList) {
  const requests = composeRequests(exchange, futuresList);

  return Promise.all(requests);
}

async function fetchFuturesInfo(exchange, filters) {
  const requests = [
    get({ exchange, filters }),
    getPreviousFunding({ exchange }),
  ];

  return Promise.all(requests);
}

async function fetchData(exchange, filters) {
  const [futuresList, previousFunding] = await fetchFuturesInfo(
    exchange,
    filters
  );

  if (futuresList.length === 0) {
    throw new EmptyResultsError('No futures found');
  }

  const incompleteStats = await fetchIncompleteStats(exchange, futuresList);

  return { futuresList, previousFunding, incompleteStats };
}

function composeEntry(futuresEntry, previousFunding, incompleteStats, index) {
  const previousFundingEntry = previousFunding.find(
    ({ future }) => future === futuresEntry.name
  );

  const { nextFundingRate } = incompleteStats[index];

  return {
    name: futuresEntry.name,
    underlying: futuresEntry.underlying,
    lastPrice: futuresEntry.last,
    markPrice: futuresEntry.mark,
    change1h: futuresEntry.change1h,
    change24h: futuresEntry.change24h,
    volume24h: futuresEntry.volume,
    volumeUsd24h: futuresEntry.volumeUsd24h,
    openInterest: futuresEntry.openInterest,
    openInterestUsd: futuresEntry.openInterestUsd,
    previousFundingRate: previousFundingEntry?.rate ?? null,
    nextFundingRate: nextFundingRate ?? null,
  };
}

function composeData({ futuresList, previousFunding, incompleteStats }) {
  return futuresList.map((entry, index) =>
    composeEntry(entry, previousFunding, incompleteStats, index)
  );
}

function composeCompareFunction(sortBy) {
  if (['last-price', 'lp'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.lastPrice, b.lastPrice);
  }

  if (['mark-price', 'mp'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.markPrice, b.markPrice);
  }

  if (['change-1h', 'c1'].includes(sortBy)) {
    return (a, b) =>
      compareHighToLow(a.change1hPercentage, b.change1hPercentage);
  }

  if (['change-24h', 'c24'].includes(sortBy)) {
    return (a, b) =>
      compareHighToLow(a.change24hPercentage, b.change24hPercentage);
  }

  if (['volume', 'v'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.volumeUsd24h, b.volumeUsd24h);
  }

  if (['open-interest', 'oi'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.openInterestUsd, b.openInterestUsd);
  }

  if (['previous-funding', 'pf'].includes(sortBy)) {
    return (a, b) =>
      compareHighToLow(a.previousFundingRate, b.previousFundingRate);
  }

  if (['estimated-funding', 'ef'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.nextFundingRate, b.nextFundingRate);
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

function collateData(data, sortBy) {
  const composedData = composeData(data);

  return sortData(composedData, sortBy);
}

async function getStats({ exchange, filters, sortBy }) {
  const data = await fetchData(exchange, filters);

  return collateData(data, sortBy);
}

export { getStats };
