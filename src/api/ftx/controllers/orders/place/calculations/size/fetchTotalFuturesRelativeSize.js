import BigNumber from 'bignumber.js';

import { ApiError } from '../../../../../../../common/index.js';
import { account } from '../../../../../endpoints/index.js';

function hasPosition(position) {
  return Boolean(position?.size > 0);
}

async function fetchPositionSize(exchange, credentials, market) {
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

async function fetchAvailableCollateral(exchange, credentials) {
  const { freeCollateral } = await account.getAccountInformation({
    exchange,
    credentials,
  });

  if (!hasAvailableCollateral(freeCollateral)) {
    throw new ApiError('No available collateral found');
  }

  return new BigNumber(freeCollateral);
}

async function fetchHook(exchange, credentials, data) {
  return data.sizeHook === 'position'
    ? fetchPositionSize(exchange, credentials, data.market)
    : fetchAvailableCollateral(exchange, credentials);
}

async function fetchTotalFuturesRelativeSize(exchange, credentials, data) {
  const hook = await fetchHook(exchange, credentials, data);

  return data.size.value(hook);
}

export { fetchTotalFuturesRelativeSize };
