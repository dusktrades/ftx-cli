import { compareAToZ } from '../../../../util/index.js';
import { markets } from '../../endpoints/index.js';
import { allowCurrency } from '../allowCurrency.js';

function filterData(data, filters) {
  if (filters == null) {
    return data;
  }

  return data.filter(
    (entry) =>
      entry.type === 'spot' &&
      allowCurrency(filters.currencies, entry.underlying)
  );
}

function sortData(data) {
  return [...data].sort((a, b) => compareAToZ(a.name, b.name));
}

function processData(data, filters) {
  const filteredData = filterData(data, filters);

  return sortData(filteredData);
}

async function get({ exchange, filters }) {
  const data = await markets.getMarkets({ exchange });

  return processData(data, filters);
}

export { get };
