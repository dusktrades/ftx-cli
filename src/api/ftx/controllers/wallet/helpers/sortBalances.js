import { compareAToZ, compareHighToLow } from '../../../../../util/index.js';

function composeCompareFunction(sortBy) {
  if (['available-without-borrowing', 'awob'].includes(sortBy)) {
    return (a, b) =>
      compareHighToLow(
        a.availableWithoutBorrowing,
        b.availableWithoutBorrowing
      );
  }

  if (['available-with-borrowing', 'awb'].includes(sortBy)) {
    return (a, b) =>
      compareHighToLow(a.availableWithBorrowing, b.availableWithBorrowing);
  }

  if (['borrowed', 'b'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.borrowed, b.borrowed);
  }

  if (['total', 't'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.total, b.total);
  }

  if (['total-usd', 'u'].includes(sortBy)) {
    return (a, b) => compareHighToLow(a.totalUsd, b.totalUsd);
  }

  return null;
}

function sortBalances(balances, sortBy) {
  const alphabetical = [...balances].sort((a, b) =>
    compareAToZ(a.currency, b.currency)
  );

  const compareFunction = composeCompareFunction(sortBy);

  return compareFunction == null
    ? alphabetical
    : alphabetical.sort(compareFunction);
}

export { sortBalances };
