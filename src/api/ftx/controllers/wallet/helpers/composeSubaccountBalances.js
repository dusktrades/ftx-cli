import { compareAToZ, compareHighToLow } from '../../../../../util/index.js';
import { sortData } from '../../sortData.js';
import { calculateAllocation } from './calculateAllocation.js';
import { calculateTotalUsd } from './calculateTotalUsd.js';

function composeSortCompare(sortBy) {
  switch (sortBy) {
    case 'available-without-borrowing':
      return (a, b) =>
        compareHighToLow(
          a.availableWithoutBorrowing,
          b.availableWithoutBorrowing
        );
    case 'available-with-borrowing':
      return (a, b) =>
        compareHighToLow(a.availableWithBorrowing, b.availableWithBorrowing);
    case 'borrowed':
      return (a, b) => compareHighToLow(a.borrowed, b.borrowed);
    case 'total':
      return (a, b) => compareHighToLow(a.total, b.total);
    case 'total-usd':
      return (a, b) => compareHighToLow(a.totalUsd, b.totalUsd);
    default:
      return null;
  }
}

function initialCompare(a, b) {
  return compareAToZ(a.currency, b.currency);
}

function composeSubaccountBalances(balances, sortBy) {
  const totalUsd = calculateTotalUsd(balances);

  const updatedBalances = balances.map((entry) => ({
    ...entry,
    allocation: calculateAllocation(entry.totalUsd, totalUsd),
  }));

  const sortCompare = composeSortCompare(sortBy);

  return {
    balances: sortData(updatedBalances, initialCompare, sortCompare),
    totalUsd,
  };
}

export { composeSubaccountBalances };
