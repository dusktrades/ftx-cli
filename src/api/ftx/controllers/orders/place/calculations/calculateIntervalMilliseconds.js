import BigNumber from 'bignumber.js';

import { calculateAdditionalOrderCount } from './calculateAdditionalOrderCount.js';

function calculateIntervalMilliseconds({ duration, split }) {
  if (duration.isZero()) {
    return new BigNumber(0);
  }

  const additionalOrderCount = calculateAdditionalOrderCount(split);

  if (additionalOrderCount.isZero()) {
    return new BigNumber(0);
  }

  return duration.dividedBy(additionalOrderCount);
}

export { calculateIntervalMilliseconds };
