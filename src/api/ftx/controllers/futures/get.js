import { futures } from '../../endpoints/index.js';
import { allowCurrency } from '../allowCurrency.js';

function allowType(allowedType, type) {
  if (allowedType == null) {
    return true;
  }

  return type === allowedType;
}

function filterData(data, filters) {
  if (filters == null) {
    return data;
  }

  return data.filter(
    (entry) =>
      allowCurrency(filters.currencies, entry.underlying) &&
      allowType(filters.type, entry.type)
  );
}

async function get({ exchange, filters }) {
  const data = await futures.getFutures({ exchange });

  return filterData(data, filters);
}

export { get };
