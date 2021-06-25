import { EmptyResultsError } from '../../../../common/errors/index.js';
import { compareAToZ, compareHighToLow } from '../../../../util/index.js';
import { spotMargin } from '../../endpoints/index.js';
import { allowCurrency } from '../allowCurrency.js';

function filterData(data, filters) {
  if (filters == null) {
    return data;
  }

  return data.filter((entry) => allowCurrency(filters.currencies, entry.coin));
}

function sortData(data, sortBy) {
  const alphabeticalData = [...data].sort((a, b) =>
    compareAToZ(a.coin, b.coin)
  );

  if (sortBy === 'previous') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.previous, b.previous)
    );
  }

  if (sortBy === 'estimated') {
    return alphabeticalData.sort((a, b) =>
      compareHighToLow(a.estimated, b.estimated)
    );
  }

  return alphabeticalData;
}

// TODO: Reuse.
function processData(data, filters, sortBy) {
  const filteredData = filterData(data, filters);

  return sortData(filteredData, sortBy);
}

async function get({ exchange, filters, sortBy }) {
  const data = await spotMargin.getLendingRates({ exchange });

  if (data.length === 0) {
    throw new EmptyResultsError('No lending rates found');
  }

  return processData(data, filters, sortBy);
}

export { get };
