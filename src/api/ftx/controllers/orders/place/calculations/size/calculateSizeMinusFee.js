import BigNumber from 'bignumber.js';

import { account } from '../../../../../endpoints/index.js';

async function getMinimumFeeMultiplier(exchange, credentials) {
  const { makerFee, takerFee } = await account.getAccountInformation({
    exchange,
    credentials,
  });

  return new BigNumber(1).minus(BigNumber.maximum(makerFee, takerFee));
}

async function calculateMinimumMultiplier(exchange, credentials) {
  const minimumFeeMultiplier = await getMinimumFeeMultiplier(
    exchange,
    credentials
  );

  return BigNumber.minimum(minimumFeeMultiplier, 1);
}

async function calculateSizeMinusFee(exchange, credentials, totalSize) {
  const minimumMultiplier = await calculateMinimumMultiplier(
    exchange,
    credentials
  );

  return totalSize.multipliedBy(minimumMultiplier);
}

export { calculateSizeMinusFee };
