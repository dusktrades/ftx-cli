import BigNumber from 'bignumber.js';

import { wallet } from '../../endpoints/index.js';
import { collateSubaccountBalances } from './helpers/collateSubaccountBalances.js';
import { composeSubaccountBalances } from './helpers/composeSubaccountBalances.js';
import { sortSubaccounts } from './helpers/sortSubaccounts.js';

const sumKeys = new Set([
  'availableWithoutBorrowing',
  'availableWithBorrowing',
  'borrowed',
  'total',
  'totalUsd',
]);

function composeSubaccountsData(data, sortBy) {
  const normalisedData = Object.entries(data).map(([subaccount, balances]) => ({
    subaccount,
    ...collateSubaccountBalances(balances, sortBy),
  }));

  return sortSubaccounts(normalisedData);
}

function updateTotalBalances(totalBalances, balance, index) {
  for (const [key, value] of Object.entries(totalBalances[index])) {
    if (sumKeys.has(key)) {
      totalBalances[index][key] = new BigNumber(value)
        .plus(balance[key])
        .toNumber();
    }
  }
}

function calculateTotalBalances(subaccountsData) {
  const totalBalances = [];

  for (const { balances } of subaccountsData) {
    for (const balance of balances) {
      const index = totalBalances.findIndex(
        ({ currency }) => currency === balance.currency
      );

      // No running balance for this currency yet: add it (without allocation).
      if (index === -1) {
        totalBalances.push({ ...balance, allocation: null });
      }

      // Found running balance for this currency: update it.
      if (index >= 0) {
        updateTotalBalances(totalBalances, balance, index);
      }
    }
  }

  return totalBalances;
}

function collateData(data, sortBy) {
  const subaccountsData = composeSubaccountsData(data, sortBy);
  const totalBalances = calculateTotalBalances(subaccountsData);

  return {
    subaccounts: subaccountsData,
    total: composeSubaccountBalances(totalBalances, sortBy),
  };
}

async function getAllSubaccounts({ exchange, credentials, sortBy }) {
  const data = await wallet.getAllBalances({ exchange, credentials });

  return collateData(data, sortBy);
}

export { getAllSubaccounts };
