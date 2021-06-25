import { EmptyResultsError } from '../../../../common/errors/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { spotMargin } from '../../endpoints/index.js';
import { allowCurrency } from '../allowCurrency.js';

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
      allowCurrency(filters.currencies, entry.coin) &&
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

function processData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);

  return sortData(filteredData, sortBy);
}

async function get({ exchange, credentials, filters, sortBy }) {
  // Lending info endpoint gives more detail than lending offers endpoint.
  const data = await spotMargin.getLendingInfo({ exchange, credentials });

  if (data.length === 0) {
    throw new EmptyResultsError('No lending offers found');
  }

  return processData(data, filters, sortBy);
}

export { get };
