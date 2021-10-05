import BigNumber from 'bignumber.js';

import { parseNumber } from '../../helpers/index.js';

function parse(split) {
  return parseNumber(split, 'Split must be an integer greater than zero.', {
    allowNegative: false,
    allowZero: false,
    allowFloat: false,
  });
}

const SPLIT = {
  name: 'split',
  flags: '--split <count>',
  description: 'Splits the order into a number of smaller, equal-sized orders.',
  parser: parse,
  default: new BigNumber(1),
};

export { SPLIT };
