import BigNumber from 'bignumber.js';

function isValidSize(size) {
  const safeSize = new BigNumber(size);

  // Size should be a number greater than zero.
  return !safeSize.isNaN() && safeSize.isPositive();
}

export { isValidSize };
