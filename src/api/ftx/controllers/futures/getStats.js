import { EmptyResultsError } from '../../../../common/index.js';

import {
  compareAToZ,
  compareHighToLow,
  convertDecimalToPercentage,
} from '../../../../util/index.js';

import { futures } from '../../endpoints/index.js';
import { get } from './get.js';
import { getPreviousFunding } from './getPreviousFunding.js';

function composeRequest(exchange, name) {
  return futures.getFutureStats({ exchange, pathParameters: { name } });
}

function composeRequests(exchange, futuresList) {
  return futuresList.map((entry) => composeRequest(exchange, entry.name));
}

async function getIncompleteStats(exchange, futuresList) {
  const requests = composeRequests(exchange, futuresList);

  return Promise.all(requests);
}

async function getFuturesInfo(exchange, filters) {
  const requests = [
    get({ exchange, filters }),
    getPreviousFunding({ exchange }),
  ];

  return Promise.all(requests);
}

async function getDataSources(exchange, filters) {
  const [futuresList, previousFunding] = await getFuturesInfo(
    exchange,
    filters
  );

  if (futuresList.length === 0) {
    throw new EmptyResultsError('No futures found');
  }

  const incompleteStats = await getIncompleteStats(exchange, futuresList);

  return { futuresList, previousFunding, incompleteStats };
}

function findPreviousFundingEntry(futureEntry, previousFunding) {
  return previousFunding.find((entry) => entry.future === futureEntry.name);
}

function composeEntry(futureEntry, previousFunding, incompleteStats, index) {
  const previousFundingEntry = findPreviousFundingEntry(
    futureEntry,
    previousFunding
  );

  const incompleteStatsEntry = incompleteStats[index];

  return {
    name: futureEntry.name,
    underlying: futureEntry.underlying,
    lastPrice: futureEntry.last,
    markPrice: futureEntry.mark,
    change1hPercentage: convertDecimalToPercentage(futureEntry.change1h),
    change24hPercentage: convertDecimalToPercentage(futureEntry.change24h),
    volume24h: futureEntry.volume,
    volumeUsd24h: futureEntry.volumeUsd24h,
    openInterest: futureEntry.openInterest,
    openInterestUsd: futureEntry.openInterestUsd,
    previousFundingRate: previousFundingEntry?.rate,
    nextFundingRate: incompleteStatsEntry.nextFundingRate,
  };
}

function composeData({ futuresList, previousFunding, incompleteStats }) {
  return futuresList.map((entry, index) =>
    composeEntry(entry, previousFunding, incompleteStats, index)
  );
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    compareAToZ(a.name, b.name)
  );

  if (['last-price', 'lp'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.lastPrice, b.lastPrice)
    );
  }

  if (['mark-price', 'mp'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.markPrice, b.markPrice)
    );
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

  if (['open-interest', 'oi'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.openInterestUsd, b.openInterestUsd)
    );
  }

  if (['previous-funding', 'pf'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.previousFundingRate, b.previousFundingRate)
    );
  }

  if (['estimated-funding', 'ef'].includes(sortBy)) {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.nextFundingRate, b.nextFundingRate)
    );
  }

  return alphabeticalData;
}

async function getStats({ exchange, filters, sortBy }) {
  const dataSources = await getDataSources(exchange, filters);
  const data = composeData(dataSources);

  return sortData(data, sortBy);
}

export { getStats };
