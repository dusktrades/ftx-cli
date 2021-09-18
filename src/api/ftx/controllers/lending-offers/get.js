import BigNumber from 'bignumber.js';

import { EmptyResultsError } from '../../../../common/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { spotMargin } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';

function allowActive(filter, { offered, locked }) {
  return filter == null ? true : offered > 0 || locked > 0;
}

function allowLendable(filter, lendable) {
  return filter == null ? true : lendable > 0;
}

function allowOffered(filter, offered) {
  return filter == null ? true : offered > 0;
}

function filterData(data, filters) {
  return filters == null
    ? data
    : data.filter(
        (entry) =>
          allowValue(filters.currencies, entry.coin) &&
          allowActive(filters.active, entry) &&
          allowLendable(filters.lendable, entry.lendable) &&
          allowOffered(filters.offered, entry.offered)
      );
}

/**
 * Lendable size is problematic and untrustworthy:
 *
 * - Unpredictable slightly inconsistent values sometimes returned
 * - 'Size too large' errors despite size being under lendable size
 *
 * We 'correct' this (i.e. greatly reduce number of unexpected errors) by
 * rounding lendable size down to 6 decimal places. The FTX UI also does this.
 */
function correctLendable(lendable) {
  return new BigNumber(lendable)
    .decimalPlaces(6, BigNumber.ROUND_DOWN)
    .toNumber();
}

function normaliseData(data) {
  return data.map((entry) => ({
    ...entry,
    lendableCorrected: correctLendable(entry.lendable),
  }));
}

function composeCompareFunction(sortBy) {
  if (['lendable', 'le'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.lendable, b.lendable);
  }

  if (['offered', 'o'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.offered, b.offered);
  }

  if (['locked', 'lo'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.locked, b.locked);
  }

  if (['min-rate', 'r'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.minRate, b.minRate);
  }

  return null;
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    compareAToZ(a.coin, b.coin)
  );

  const compareFunction = composeCompareFunction(sortBy);

  return compareFunction == null
    ? alphabeticalData
    : alphabeticalData.sort(compareFunction);
}

function collateData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);

  if (filteredData.length === 0) {
    throw new EmptyResultsError('No lending offers found');
  }

  const normalisedData = normaliseData(filteredData);

  return sortData(normalisedData, sortBy);
}

async function get({ exchange, credentials, filters, sortBy }) {
  // Lending info endpoint gives more detail than lending offers endpoint.
  const data = await spotMargin.getLendingInfo({ exchange, credentials });

  return collateData(data, filters, sortBy);
}

export { get };
