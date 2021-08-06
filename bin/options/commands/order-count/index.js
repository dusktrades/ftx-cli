import BigNumber from 'bignumber.js';

import { composeOption, parseNumber } from '../../helpers/index.js';

function parse(orderCount) {
  return parseNumber(
    orderCount,
    'Order count must be an integer greater than zero.',
    {
      allowNegative: false,
      allowZero: false,
      allowFloat: false,
    }
  );
}

const CONFIG = {
  FLAGS: '--count <count>',
  DESCRIPTION: 'order count',
  PARSER: parse,
  DEFAULT: new BigNumber(1),
};

const ORDER_COUNT = composeOption(CONFIG);

export { ORDER_COUNT };
