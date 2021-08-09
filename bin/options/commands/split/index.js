import BigNumber from 'bignumber.js';

import { parseNumber } from '../../helpers/index.js';

function parse(splitCount) {
  return parseNumber(
    splitCount,
    'Split must be an integer greater than zero.',
    {
      allowNegative: false,
      allowZero: false,
      allowFloat: false,
    }
  );
}

const SPLIT = {
  FLAGS: '--split <count>',
  DESCRIPTION: 'split count',
  PARSER: parse,
  DEFAULT: new BigNumber(1),
};

export { SPLIT };
