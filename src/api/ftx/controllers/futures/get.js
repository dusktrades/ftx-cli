import { futures } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';

function filterData(data, filters) {
  return data.filter(
    ({ enabled, type, underlying }) =>
      enabled &&
      allowValue(filters.type, type) &&
      allowValue(filters.underlying, underlying)
  );
}

async function get({ exchange, filters }) {
  const data = await futures.getFutures({ exchange });

  return filterData(data, filters);
}

export { get };
