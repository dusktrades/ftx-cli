import BigNumber from 'bignumber.js';

import { parseNumber } from '../../helpers/index.js';

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

const ORDER_COUNT = {
  FLAGS: '--count <count>',
  DESCRIPTION: 'order count',
  PARSER: parse,
  DEFAULT: new BigNumber(1),
};

export { ORDER_COUNT };
