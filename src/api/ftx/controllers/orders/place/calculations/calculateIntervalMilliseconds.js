import BigNumber from 'bignumber.js';

import { calculateAdditionalOrderCount } from './calculateAdditionalOrderCount.js';

function calculateIntervalMilliseconds({ durationMilliseconds, splitCount }) {
  if (durationMilliseconds.isZero()) {
    return new BigNumber(0);
  }

  const additionalOrderCount = calculateAdditionalOrderCount(splitCount);

  if (additionalOrderCount.isZero()) {
    return new BigNumber(0);
  }

  return durationMilliseconds.dividedBy(additionalOrderCount);
}

export { calculateIntervalMilliseconds };
