import BigNumber from 'bignumber.js';

function calculateTotalUsd(balances) {
  let value = new BigNumber(0);

  for (const { totalUsd } of balances) {
    value = value.plus(totalUsd);
  }

  return value.toNumber();
}

export { calculateTotalUsd };
