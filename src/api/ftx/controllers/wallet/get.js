import BigNumber from 'bignumber.js';

import { compareAToZ } from '../../../../util/index.js';
import { wallet } from '../../endpoints/index.js';

const balanceKeys = [
  'free',
  'spotBorrow',
  'total',
  'usdValue',
  'availableWithoutBorrow',
];

async function getNormalisedSubaccountBalances({ exchange, credentials }) {
  const balances = await wallet.getBalances({
    exchange,
    credentials,
  });

  return { [credentials.subaccount]: balances };
}

async function getData({ exchange, credentials }) {
  if (credentials.subaccount != null) {
    return getNormalisedSubaccountBalances({ exchange, credentials });
  }

  return wallet.getAllBalances({ exchange, credentials });
}

function removeZeroBalances(balances) {
  return balances.filter(({ total }) => total > 0);
}

function calculateTotalBalanceUsd(balances) {
  let balanceUsd = new BigNumber(0);

  for (const { usdValue } of balances) {
    balanceUsd = balanceUsd.plus(usdValue);
  }

  return balanceUsd.toNumber();
}

function calculateAllocationPercentage(balanceEntry, totalBalanceUsd) {
  return new BigNumber(balanceEntry.usdValue)
    .dividedBy(totalBalanceUsd)
    .multipliedBy(100)
    .toNumber();
}

function addBalanceAllocations(balances, totalBalanceUsd) {
  return balances.map((entry) => ({
    ...entry,
    allocationPercentage: calculateAllocationPercentage(entry, totalBalanceUsd),
  }));
}

function sortBalances(balances) {
  return balances.sort((a, b) => compareAToZ(a.coin, b.coin));
}

function composeBalances(balances, totalBalanceUsd) {
  const balancesWithAllocations = addBalanceAllocations(
    balances,
    totalBalanceUsd
  );

  return sortBalances(balancesWithAllocations);
}

function sortSubaccounts(subaccounts) {
  return subaccounts.sort((a, b) => {
    // Sort main account first.
    if (a.subaccount === 'main') {
      return -1;
    }

    if (b.subaccount === 'main') {
      return 1;
    }

    // Sort subaccounts alphabetically.
    return compareAToZ(a.subaccount, b.subaccount);
  });
}

function composeSubaccounts(data) {
  const subaccounts = Object.entries(data).map(([subaccount, balances]) => {
    const nonZeroBalances = removeZeroBalances(balances);
    const subaccountBalanceUsd = calculateTotalBalanceUsd(nonZeroBalances);

    return {
      subaccount,
      balances: composeBalances(nonZeroBalances, subaccountBalanceUsd),
      subaccountBalanceUsd,
    };
  });

  return sortSubaccounts(subaccounts);
}

function composeTotalAccount(subaccounts) {
  const totalAccountBalances = [];

  for (const { balances } of subaccounts) {
    for (const balanceEntry of balances) {
      const balanceEntryCopy = { ...balanceEntry };

      const existingIndex = totalAccountBalances.findIndex(
        (existingEntry) => existingEntry.coin === balanceEntryCopy.coin
      );

      // We haven't encountered this currency yet: add it.
      if (existingIndex === -1) {
        totalAccountBalances.push(balanceEntryCopy);
      } else {
        for (const key of balanceKeys) {
          const currentValue = totalAccountBalances[existingIndex][key];

          // Update the total account balance key's value.
          totalAccountBalances[existingIndex][key] = new BigNumber(currentValue)
            .plus(balanceEntryCopy[key])
            .toNumber();
        }
      }
    }
  }

  const totalAccountBalanceUsd = calculateTotalBalanceUsd(totalAccountBalances);

  return {
    balances: composeBalances(totalAccountBalances, totalAccountBalanceUsd),
    totalAccountBalanceUsd,
  };
}

function normaliseData(data) {
  const subaccounts = composeSubaccounts(data);

  return {
    subaccounts,
    totalAccount: composeTotalAccount(subaccounts),
  };
}

async function get(options) {
  const data = await getData(options);

  return normaliseData(data);
}

export { get };
