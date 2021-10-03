import { EmptyResultsError } from '../../../../common/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { spotMargin } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';
import { sortData } from '../sortData.js';

function filterData(data, filters) {
  return filters == null
    ? data
    : data.filter(({ coin }) => allowValue(filters.currencies, coin));
}

function composeSortCompare(sortBy) {
  switch (sortBy) {
    case 'previous':
      return (a, b) => compareHighToLow(a.previous, b.previous);
    case 'estimated':
      return (a, b) => compareHighToLow(a.estimate, b.estimate);
    default:
      return null;
  }
}

function initialCompare(a, b) {
  return compareAToZ(a.coin, b.coin);
}

function collateData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);

  /**
   * TODO: Deal with empty results client-side. Should output minimal 'No
   * matching records found.' table row or empty array as JSON.
   */
  if (filteredData.length === 0) {
    throw new EmptyResultsError('No lending rates found');
  }

  const sortCompare = composeSortCompare(sortBy);

  return sortData(filteredData, initialCompare, sortCompare);
}

async function get({ exchange, filters, sortBy }) {
  const data = await spotMargin.getLendingRates({ exchange });

  return collateData(data, filters, sortBy);
}

export { get };
