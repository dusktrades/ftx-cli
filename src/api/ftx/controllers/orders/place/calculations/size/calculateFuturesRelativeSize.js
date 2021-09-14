import BigNumber from 'bignumber.js';

import { ApiError } from '../../../../../../../common/index.js';
import { account } from '../../../../../endpoints/index.js';

function hasPosition(position) {
  return Boolean(position?.size > 0);
}

async function calculatePositionSize(exchange, credentials, market) {
  const positions = await account.getPositions({ exchange, credentials });
  const position = positions.find(({ future }) => future === market);

  if (!hasPosition(position)) {
    throw new ApiError(`No ${market} position found`);
  }

  return new BigNumber(position.size);
}

function hasAvailableCollateral(availableCollateral) {
  return availableCollateral > 0;
}

async function calculateCollateralInUnderlying(
  exchange,
  credentials,
  marketPrice
) {
  const { freeCollateral } = await account.getAccountInformation({
    exchange,
    credentials,
  });

  if (!hasAvailableCollateral(freeCollateral)) {
    throw new ApiError('No available collateral found');
  }

  return new BigNumber(freeCollateral).dividedBy(marketPrice);
}

async function calculateHook(exchange, credentials, data, marketPrice) {
  return data.sizeHook.value === 'position'
    ? calculatePositionSize(exchange, credentials, data.market)
    : calculateCollateralInUnderlying(exchange, credentials, marketPrice);
}

async function calculateFuturesRelativeSize(
  exchange,
  credentials,
  data,
  marketPrice
) {
  const hook = await calculateHook(exchange, credentials, data, marketPrice);

  return data.size.value(hook);
}

export { calculateFuturesRelativeSize };
