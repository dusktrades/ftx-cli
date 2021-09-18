import { calculateAllocation } from './calculateAllocation.js';
import { calculateTotalUsd } from './calculateTotalUsd.js';
import { sortBalances } from './sortBalances.js';

function composeSubaccountBalances(balances, sortBy) {
  const totalUsd = calculateTotalUsd(balances);

  const updatedBalances = balances.map((entry) => ({
    ...entry,
    allocation: calculateAllocation(entry.totalUsd, totalUsd),
  }));

  return {
    balances: sortBalances(updatedBalances, sortBy),
    totalUsd,
  };
}

export { composeSubaccountBalances };
