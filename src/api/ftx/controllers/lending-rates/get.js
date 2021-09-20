import { EmptyResultsError } from '../../../../common/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { spotMargin } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';

function filterData(data, filters) {
  return filters == null
    ? data
    : data.filter(({ coin }) => allowValue(filters.currencies, coin));
}

function composeCompareFunction(sortBy) {
  if (['previous', 'p'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.previous, b.previous);
  }

  if (['estimated', 'e'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.estimate, b.estimate);
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

  /**
   * TODO: Deal with empty results client-side. Should output minimal 'No
   * matching records found.' table row or empty array as JSON.
   */
  if (filteredData.length === 0) {
    throw new EmptyResultsError('No lending rates found');
  }

  return sortData(filteredData, sortBy);
}

async function get({ exchange, filters, sortBy }) {
  const data = await spotMargin.getLendingRates({ exchange });

  return collateData(data, filters, sortBy);
}

export { get };
