import BigNumber from 'bignumber.js';

function calculateAllocation(balanceTotalUsd, subaccountTotalUsd) {
  return new BigNumber(balanceTotalUsd)
    .dividedBy(subaccountTotalUsd)
    .toNumber();
}

export { calculateAllocation };
