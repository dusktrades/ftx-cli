import BigNumber from 'bignumber.js';

import { calculateAdditionalOrderCount } from './calculateAdditionalOrderCount.js';

function calculateOffset({ from, to }) {
  return to.minus(from);
}

function calculatePriceStep({ price, splitCount }) {
  // If user hasn't provided price, or price isn't a range, the price step is 0.
  if (price?.type !== 'range') {
    return new BigNumber(0);
  }

  const offset = calculateOffset(price.value);

  // If the two range numbers are the same, the price step is 0.
  if (offset.isZero()) {
    return new BigNumber(0);
  }

  const additionalOrderCount = calculateAdditionalOrderCount(splitCount);

  // If there is only one individual order, the price step is 0.
  return additionalOrderCount.isZero()
    ? new BigNumber(0)
    : offset.dividedBy(additionalOrderCount);
}

export { calculatePriceStep };
