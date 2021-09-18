/* eslint-disable unicorn/require-number-to-fixed-digits-argument */

import BigNumber from 'bignumber.js';

function formatNormalNumberNotation(number) {
  return BigNumber(number).toFixed();
}

export { formatNormalNumberNotation };
