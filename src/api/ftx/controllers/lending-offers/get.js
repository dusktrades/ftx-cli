import BigNumber from 'bignumber.js';

import { EmptyResultsError } from '../../../../common/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { spotMargin } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';

/**
 * Lendable size is problematic and untrustworthy:
 *
 * - Unpredictable slightly inconsistent values sometimes returned
 * - 'Size too large' errors despite size being under lendable size
 *
 * We 'fix' this (i.e. greatly reduce number of unexpected errors) by rounding
 * lendable size down to 6 decimal places. The FTX UI also does this.
 */
function fixLendableSize(lendableSize) {
  const parsedLendableSize = new BigNumber(lendableSize);

  return parsedLendableSize.decimalPlaces(6, BigNumber.ROUND_DOWN).toNumber();
}

function normaliseData(data) {
  return data.map((entry) => ({
    ...entry,
    lendable: fixLendableSize(entry.lendable),
  }));
}

function allowActive(filter = false, entry) {
  if (!filter) {
    return true;
  }

  return entry.offered > 0 || entry.locked > 0;
}

function allowLendable(filter = false, lendableSize) {
  if (!filter) {
    return true;
  }

  return lendableSize > 0;
}

function allowOffered(filter = false, offeredSize) {
  if (!filter) {
    return true;
  }

  return offeredSize > 0;
}

function filterData(data, filters) {
  if (filters == null) {
    return data;
  }

  return data.filter(
    (entry) =>
      allowValue(filters.currencies, entry.coin) &&
      allowActive(filters.active, entry) &&
      allowLendable(filters.lendable, entry.lendable) &&
      allowOffered(filters.offered, entry.offered)
  );
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    compareAToZ(a.coin, b.coin)
  );

  if (sortBy === 'lendable') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.lendable, b.lendable)
    );
  }

  if (sortBy === 'offered') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.offered, b.offered)
    );
  }

  if (sortBy === 'locked') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.locked, b.locked)
    );
  }

  if (sortBy === 'min-rate') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.minRate, b.minRate)
    );
  }

  return alphabeticalData;
}

function collateData(data, filters, sortBy) {
  const normalisedData = normaliseData(data);
  const filteredData = filterData(normalisedData, filters);

  if (filteredData.length === 0) {
    throw new EmptyResultsError('No lending offers found');
  }

  return sortData(filteredData, sortBy);
}

async function get({ exchange, credentials, filters, sortBy }) {
  // Lending info endpoint gives more detail than lending offers endpoint.
  const data = await spotMargin.getLendingInfo({ exchange, credentials });

  return collateData(data, filters, sortBy);
}

export { get };
