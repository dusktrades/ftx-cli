import { sortAlphabetically } from '../util/index.js';

function composeTableData(data, composeEntry) {
  return data
    .map((entry) => composeEntry(entry))
    .sort(([currencyA], [currencyB]) =>
      sortAlphabetically(currencyA, currencyB)
    );
}

export { composeTableData };
