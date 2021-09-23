import { futures } from '../../endpoints/index.js';
import { allowValue } from '../allowValue.js';

function filterData(data, filters) {
  return data.filter(
    ({ type, underlying }) =>
      allowValue(filters.underlying, underlying) &&
      allowValue(filters.type, type)
  );
}

async function get({ exchange, filters }) {
  const data = await futures.getFutures({ exchange });

  return filterData(data, filters);
}

export { get };
