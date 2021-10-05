import { EmptyResultsError } from '../../../../common/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { futures } from '../../endpoints/index.js';
import { sortData } from '../sortData.js';
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

  // TODO: Show in table UI/JSON empty array instead of throwing error.
  if (futuresList.length === 0) {
    throw new EmptyResultsError('No futures found');
  }

  const incompleteStats = await fetchIncompleteStats(exchange, futuresList);

  return { futuresList, previousFunding, incompleteStats };
}

function getPreviousFundingRate(name, previousFunding) {
  const entry = previousFunding.find(({ future }) => future === name);

  return entry?.rate ?? null;
}

function getNextFundingRate(incompleteStatsEntry) {
  return incompleteStatsEntry.nextFundingRate ?? null;
}

function composeEntry(futuresEntry, previousFunding, incompleteStatsEntry) {
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
    previousFundingRate: getPreviousFundingRate(
      futuresEntry.name,
      previousFunding
    ),
    nextFundingRate: getNextFundingRate(incompleteStatsEntry),
  };
}

function composeData({ futuresList, previousFunding, incompleteStats }) {
  return futuresList.map((entry, index) =>
    composeEntry(entry, previousFunding, incompleteStats[index])
  );
}

function composeSortCompare(sortBy) {
  switch (sortBy) {
    case 'mark-price':
      return (a, b) => compareHighToLow(a.markPrice, b.markPrice);
    case 'last-price':
      return (a, b) => compareHighToLow(a.lastPrice, b.lastPrice);
    case 'change-1h':
      return (a, b) =>
        compareHighToLow(a.change1hPercentage, b.change1hPercentage);
    case 'change-24h':
      return (a, b) =>
        compareHighToLow(a.change24hPercentage, b.change24hPercentage);
    case 'volume':
      return (a, b) => compareHighToLow(a.volumeUsd24h, b.volumeUsd24h);
    case 'open-interest':
      return (a, b) => compareHighToLow(a.openInterestUsd, b.openInterestUsd);
    case 'previous-funding':
      return (a, b) =>
        compareHighToLow(a.previousFundingRate, b.previousFundingRate);
    case 'estimated-funding':
      return (a, b) => compareHighToLow(a.nextFundingRate, b.nextFundingRate);
    default:
      return null;
  }
}

function initialCompare(a, b) {
  return compareAToZ(a.name, b.name);
}

function collateData(data, sortBy) {
  const composedData = composeData(data);
  const sortCompare = composeSortCompare(sortBy);

  return sortData(composedData, initialCompare, sortCompare);
}

async function getStats({ exchange, filters, sortBy }) {
  const data = await fetchData(exchange, filters);

  return collateData(data, sortBy);
}

export { getStats };
