import { composeSubaccountBalances } from './composeSubaccountBalances.js';

function normaliseBalance(balance) {
  return {
    currency: balance.coin,
    availableWithoutBorrowing: balance.availableWithoutBorrow,
    availableWithBorrowing: balance.free,
    borrowed: balance.spotBorrow,
    total: balance.total,
    totalUsd: balance.usdValue,
  };
}

function normaliseBalances(balances) {
  return balances
    .filter(({ total }) => total > 0)
    .map((entry) => normaliseBalance(entry));
}

function collateSubaccountBalances(balances, sortBy) {
  const normalisedBalances = normaliseBalances(balances);

  return composeSubaccountBalances(normalisedBalances, sortBy);
}

export { collateSubaccountBalances };
